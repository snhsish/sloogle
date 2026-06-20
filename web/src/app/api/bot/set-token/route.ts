import { db } from "@/db";
import { apiKey, user, workspaceConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return Response.json({
            valid: false,
            error: "Missing or invalid Authorization header"
        }, { status: 401 });

    const key = authHeader.slice(7);

    if (!key)
        return Response.json({ valid: false, error: "Missing key" }, { status: 400 });

    const { team_id } = await request.json();

    if (!team_id)
        return Response.json({ valid: false, error: "Missing team ID" }, { status: 400 });

    const keys = await db
        .select()
        .from(apiKey)
        .where(eq(apiKey.isActive, true))

    let matchedKey = null;
    const now = new Date();

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

    const wsc = await db
        .select()
        .from(workspaceConfig)
        .where(eq(workspaceConfig.team_id, team_id));

    if (wsc) {
        await db
            .update(workspaceConfig)
            .set({
                current_key: key,
                updatedAt: now
            })
            .where(eq(workspaceConfig.team_id, team_id));
    } else
        await db.insert(workspaceConfig).values({
            id: crypto.randomUUID(),
            team_id,
            current_key: key,
            autopublish_channels: [],
            userId: u[0].id,
            createdAt: now,
            updatedAt: now,
        });

    return Response.json({
        success: true
    }, { status: 201 });
}

