import { auth } from "@/lib/auth";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getWorkspace, getChannel, getMessage } from "@/lib/api-helper";

export async function GET(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user) {
        return Response.json({
            error: "Unauthorized"
        }, { status: 401 });
    }

    const allPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, session.user.id))
        .orderBy(desc(posts.createdAt))

    const teamIds = [...new Set(allPosts.map(p => p.team_id))];
    const channelIds = [...new Set(allPosts.map(p => p.channel_id))];

    const [workspaces, channels] = await Promise.all([
        Promise.all(teamIds.map(async (id) => {
            try {
                return {
                    id,
                    data: await getWorkspace(id)
                }
            }
            catch {
                return {
                    id,
                    data: null
                } as const;
            }
        })),
        Promise.all(channelIds.map(async (id) => {
            try {
                return {
                    id,
                    data: await getChannel(id)
                }
            } catch {
                return {
                    id,
                    data: null
                } as const;
            }
        })),
    ]);

    const workspaceMap = new Map(workspaces.filter(w => w.data).map(w => [w.id, w.data]));

    const channelMap = new Map(channels.filter(c => c.data).map(c => [c.id, c.data]));

    const enriched = await Promise.all(allPosts.map(async (post) => {
        let message = null;

        try {
            const m = await getMessage(post.channel_id, post.message_id);
            if (m) {
                message = {
                    text_preview: m.text?.slice(0, 50) ?? null,
                    user: m.user,
                    ts: m.ts,
                    thread_ts: m.thread_ts,
                    reply_count: m.reply_count,
                    file_names: [
                        ...(m.files?.map(f => f.name) ?? []),
                        ...(m.attachments?.map(a => a.title || a.fallback).filter(Boolean) ?? [])
                    ]
                }
            }
        } catch { }

        return {
            ...post,
            workspace: workspaceMap.get(post.team_id) ?? null,
            channel: channelMap.get(post.channel_id) ?? null,
            message
        }
    }));

    return Response.json(enriched, { status: 200 });
}

