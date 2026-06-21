import { Router } from "express";
import { App } from "@slack/bolt";

export function channelsRoutes(bolt: App): Router {
    const router = Router();

    router.get("/channel", async (req, res) => {
        const channelId = req.query.channel_id as string;
        console.log("[bot-api/channel] GET request", { channelId });

        if (!channelId) {
            console.log("[bot-api/channel] missing channel_id");
            return res.status(400).json({ error: "Missing 'channel_id' query param" });
        }
        const result = await bolt.client.conversations.info({
            channel: channelId,
        });
        console.log("[bot-api/channel] Slack API result", { channelFound: !!result.channel });

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