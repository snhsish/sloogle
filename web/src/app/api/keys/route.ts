import { auth } from "@/lib/auth";
import { db } from "@/db";
import { apiKey } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user) {
        return Response.json({
            error: "Unauthorized"
        }, { status: 401 });
    }

    const keys = await db
        .select({
            id: apiKey.id,
            name: apiKey.name,
            keyPrefix: apiKey.keyPrefix,
            isActive: apiKey.isActive,
            expiresAt: apiKey.expiresAt,
            lastUsedAt: apiKey.lastUsedAt,
            createdAt: apiKey.createdAt
        })
        .from(apiKey)
        .where(eq(apiKey.userId, session.user.id))
        .orderBy(desc(apiKey.createdAt))

    return Response.json(keys, { status: 200 });
}

