import { db } from "@/db";
import { apiKey, user, workspaceConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
    console.log("[bot/set-token] POST request received");

    const authHeader = request.headers.get("Authorization");
    console.log("[bot/set-token] Authorization header", authHeader ? "present" : "missing");

    if (!authHeader || !authHeader.startsWith("Bearer "))
        return Response.json({
            valid: false,
            error: "Missing or invalid Authorization header"
        }, { status: 401 });

    const key = authHeader.slice(7);

    if (!key)
        return Response.json({ valid: false, error: "Missing key" }, { status: 400 });

    const body = await request.json();
    const { team_id } = body;
    console.log("[bot/set-token] request body", { team_id });

    if (!team_id)
        return Response.json({ valid: false, error: "Missing team ID" }, { status: 400 });

    const keys = await db
        .select()
        .from(apiKey)
        .where(eq(apiKey.isActive, true))

    console.log("[bot/set-token] checking against", keys.length, "active keys");

    let matchedKey = null;
    const now = new Date();

    for (const k of keys) {
        const cmp = await bcrypt.compare(key, k.keyHash)
        if (cmp) {
            matchedKey = k;
            console.log("[bot/set-token] key matched", { keyId: k.id, keyPrefix: k.keyPrefix });
            break;
        }
    }

    if (!matchedKey) {
        console.log("[bot/set-token] no matching key found");
        return Response.json({
            valid: false,
            error: "Invalid Key"
        }, { status: 401 });
    }

    if (matchedKey.expiresAt && new Date() > matchedKey.expiresAt) {
        console.log("[bot/set-token] key expired", { expiresAt: matchedKey.expiresAt });
        return Response.json({ valid: false, error: "Key expired" }, { status: 401 });
    }

    await db.update(apiKey).set({ lastUsedAt: new Date() }).where(eq(apiKey.id, matchedKey.id));

    const u = await db
        .select({
            id: user.id,
            name: user.name
        })
        .from(user)
        .where(eq(user.id, matchedKey.userId)).limit(1);

    console.log("[bot/set-token] user found", u?.[0]);

    const wsc = await db
        .select()
        .from(workspaceConfig)
        .where(eq(workspaceConfig.team_id, team_id));

    console.log("[bot/set-token] existing workspace config", !!wsc?.[0]);

    if (wsc) {
        console.log("[bot/set-token] updating existing workspace config");
        await db
            .update(workspaceConfig)
            .set({
                current_key: key,
                updatedAt: now
            })
            .where(eq(workspaceConfig.team_id, team_id));
    } else {
        console.log("[bot/set-token] creating new workspace config");
        await db.insert(workspaceConfig).values({
            id: crypto.randomUUID(),
            team_id,
            current_key: key,
            autopublish_channels: [],
            userId: u[0].id,
            createdAt: now,
            updatedAt: now,
        });
    }

    console.log("[bot/set-token] success");
    return Response.json({
        success: true
    }, { status: 201 });
}

