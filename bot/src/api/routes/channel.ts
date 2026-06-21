import { Router } from "express";
import { App } from "@slack/bolt";

export function channelsRoutes(bolt: App): Router {
    const router = Router();

    router.get("/channel", async (req, res) => {
        const channelId = req.query.channel_id as string;
        if (!channelId) {
            return res.status(400).json({ error: "Missing 'channel_id' query param" });
        }
        const result = await bolt.client.conversations.info({
            channel: channelId,
        });
        if (!result.channel) {
            return res.status(404).json({ error: "Channel not found" });
        }
        res.json({
            channel: {
                id: result.channel.id,
                name: result.channel.name,
                topic: result.channel.topic?.value,
                purpose: result.channel.purpose?.value,
                is_private: result.channel.is_private,
                is_archived: result.channel.is_archived,
                member_count: result.channel.num_members,
                created: result.channel.created,
            }
        });
    });
    return router;
}