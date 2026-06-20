import { db } from "@/db";
import { apiKey, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return Response.json({
            valid: false,
            error: "Missing or invalid Authorization header"
        }, { status: 401 });

    const key = authHeader.slice(7);

    if (!key) return Response.json({ valid: false, error: "Missing key" }, { status: 400 });

    const keys = await db
        .select()
        .from(apiKey)
        .where(eq(apiKey.isActive, true))

    let matchedKey = null;

    for (const k of keys) {
        const cmp = await bcrypt.compare(key, k.keyHash)
        if (cmp) {
            matchedKey = k;
            break;
        }
    }

    if (!matchedKey) return Response.json({
        valid: false,
        error: "Invalid Key"
    }, { status: 401 });

    if (matchedKey.expiresAt && new Date() > matchedKey.expiresAt)
        return Response.json({ valid: false, error: "Key expired" }, { status: 401 });

    await db.update(apiKey).set({ lastUsedAt: new Date() }).where(eq(apiKey.id, matchedKey.id));

    const u = await db
        .select({
            id: user.id,
            name: user.name
        })
        .from(user)
        .where(eq(user.id, matchedKey.userId)).limit(1);

    return Response.json({
        valid: true,
        user: u,
    }, { status: 200 });
}

