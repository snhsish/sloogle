import { db } from "@/db";
import { apiKey, posts, workspaceConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
    console.log("[bot/publish] POST request received");

    const authHeader = request.headers.get("Authorization");
    console.log("[bot/publish] Authorization header", authHeader ? "present" : "missing");

    if (!authHeader || !authHeader.startsWith("Bearer "))
        return Response.json({
            valid: false,
            error: "Missing or invalid Authorization header"
        }, { status: 401 });

    const key = authHeader.slice(7);

    if (!key)
        return Response.json({ valid: false, error: "Missing key" }, { status: 400 });

    const body = await request.json();
    const { team_id, channel_id, message_id, delete_after } = body;
    console.log("[bot/publish] request body", { team_id, channel_id, message_id, delete_after });

    if (!team_id)
        return Response.json({ error: "Missing team ID" }, { status: 400 });

    const [wsc] = await db
        .select()
        .from(workspaceConfig)
        .where(eq(workspaceConfig.team_id, team_id))
        .limit(1);

    console.log("[bot/publish] workspace config found", !!wsc);

    if (!wsc || !wsc.current_key)
        return Response.json({ error: "Invalid Workspace" }, { status: 400 });

    const userKeys = await db
        .select()
        .from(apiKey)
        .where(eq(apiKey.userId, wsc.userId));

    console.log("[bot/publish] checking key against", userKeys.length, "user keys");

    let matchedKey = null;
    const now = new Date();
    const deleteAfter = delete_after ? new Date(delete_after) : null;
    const pid = crypto.randomUUID();

    for (const k of userKeys) {
        const cmp = await bcrypt.compare(key, k.keyHash)
        if (cmp) {
            matchedKey = k;
            console.log("[bot/publish] key matched", { keyId: k.id, keyPrefix: k.keyPrefix });
            break;
        }
    }

    if (!matchedKey) {
        console.log("[bot/publish] no matching key found");
        return Response.json({
            valid: false,
            error: "Invalid Key"
        }, { status: 401 });
    }

    if (matchedKey.expiresAt && new Date() > matchedKey.expiresAt) {
        console.log("[bot/publish] key expired", { expiresAt: matchedKey.expiresAt });
        return Response.json({ valid: false, error: "Key expired" }, { status: 401 });
    }

    await db.
        update(apiKey)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKey.id, matchedKey.id));

    console.log("[bot/publish] inserting new post", { pid, message_id, channel_id, team_id, userId: matchedKey.userId });

    const newPost = {
        id: pid,
        message_id,
        channel_id,
        team_id,
        userId: matchedKey.userId,
        deleteAfter,
        createdAt: now,
        updatedAt: now,
    }

    await db
        .insert(posts)
        .values(newPost);

    console.log("[bot/publish] post created successfully", { pid });
    return Response.json({
        ok: true,
        post: newPost
    }, { status: 201 });
}

