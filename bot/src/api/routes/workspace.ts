import { Router } from "express";
import { App } from "@slack/bolt";

export function workspacesRoutes(bolt: App): Router {
    const router = Router();

    router.get("/workspace", async (req, res) => {
        const teamId = (req.query.team_id as string) || (await bolt.client.auth.test()).team_id;
        console.log("[bot-api/workspace] GET request", { teamId });
        const team = await bolt.client.team.info({ team: teamId });
        console.log("[bot-api/workspace] Slack API result", { teamFound: !!team.team });
        res.json({
            workspace: {
                id: team.team?.id,
                name: team.team?.name,
                domain: team.team?.domain,
                icon: team.team?.icon?.image_132,
            }
        });
    });
    
    return router;
}