import { Router } from "express";
import { App } from "@slack/bolt";

export function messagesRoutes(bolt: App): Router {
    const router = Router();

    router.get("/message", async (req, res) => {
        const { channel, ts } = req.query;
        console.log("[bot-api/message] GET request", { channel, ts });

        if (!channel || !ts) {
            console.log("[bot-api/message] missing channel or ts");
            return res.status(400).json({
                error: "Missing `channel` or `ts` query param"
            });
        }

        const result = await bolt.client.conversations.history({
            channel: channel as string,
            latest: ts as string,
            limit: 1,
            inclusive: true
        });

        const message = result.messages?.[0];
        console.log("[bot-api/message] Slack API result", { messageFound: !!message });

        if (!message) {
            return res.status(404).json({
                error: "Message not found"
            });
        }

        res.json({
            ok: true,
            message: {
                ts: message.ts,
                channel,
                user: message.user,
                text: message.text,
                files: message.files,
                attachments: message.attachments,
                thread_ts: message.thread_ts,
                reply_count: message.reply_count,
                reactions: message.reactions,
            }
        });
    });
    
    return router;
}