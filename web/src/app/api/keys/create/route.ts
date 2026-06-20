import { auth } from "@/lib/auth";
import { db } from "@/db";
import { apiKey } from "@/db/schema";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, desc } from "drizzle-orm";

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user) {
        return Response.json({
            error: "Unauthorized"
        }, { status: 401 });
    }

    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
        return Response.json({
            error: "Name is required"
        }, { status: 400 });
    }

    const rawKey = "sk-" + crypto.randomBytes(32).toString("hex");
    const keyPrefix = rawKey.slice(0, 10);
    const keyHash = await bcrypt.hash(rawKey, 10);

    const id = crypto.randomUUID();
    const now = new Date();
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    await db.insert(apiKey).values({
        id,
        name,
        keyHash,
        keyPrefix,
        userId: session.user.id,
        isActive: true,
        expiresAt,
        lastUsedAt: null,
        createdAt: now,
        updatedAt: now,
    });

    return Response.json({
        id,
        name,
        key: rawKey,
        keyPrefix,
        createdAt: now.toISOString(),
        expiresAt: expiresAt?.toISOString() ?? null
    });
}