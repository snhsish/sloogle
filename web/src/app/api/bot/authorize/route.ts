import { db } from "@/db";
import { workspaceConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    console.log("[bot/authorize] POST request received");

    const authHeader = request.headers.get("Authorization");
    console.log("[bot/authorize] Authorization header", authHeader ? "present" : "missing");

    if (!authHeader || !authHeader.startsWith("Bearer "))
        return Response.json({
            valid: false,
            error: "Missing or invalid Authorization header"
        }, { status: 401 });

    const token = authHeader.slice(7);

    if (token !== process.env.BOT_SHARED_SECRET)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { team_id } = body;
    console.log("[bot/authorize] request body", body);

    if (!team_id)
        return Response.json({ error: "Missing team ID" }, { status: 400 });

    const wsc = await db
        .select()
        .from(workspaceConfig)
        .where(eq(workspaceConfig.team_id, team_id));

    console.log("[bot/authorize] workspace config found", !!wsc?.[0]);

    if (!wsc || !wsc[0] || !wsc[0].team_id)
        return Response.json({ error: "Invalid team ID" }, { status: 400 });

    console.log("[bot/authorize] returning workspace config", wsc[0]);
    return Response.json(wsc[0], { status: 200 });
}

