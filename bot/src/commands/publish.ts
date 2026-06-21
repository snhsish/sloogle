import { App } from "@slack/bolt";
import { extractMessageIDFromSlackURL } from "../lib/extract-id";
import { NewPostResponse, WorkspaceResponse } from "../types/response";

export function publishCommand(app: App) {
    app.command("/publish", async ({ command, ack, say }) => {
        await ack();

        const message_reference = command.text.trim();
        const message_id = message_reference.startsWith("http") ?
            extractMessageIDFromSlackURL(message_reference)
            : message_reference;
        const team_id = command.team_id;
        const channel_id = command.channel_id;

        console.log("[publish] command invoked", { message_id, team_id, channel_id });

        if (!message_id)
            await say("Invalid parameter passed. Only a valid message ID or message URL is expected");

        if (!team_id || !channel_id)
            await say("Invalid workspace or unsupported channel");

        console.log("[publish] calling /bot/authorize");
        const auth = await fetch(`${process.env.API_URL}/bot/authorize`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.BOT_SHARED_SECRET}`
            },
            body: JSON.stringify({
                team_id
            })
        })
            .then((r) => { console.log("[publish] /bot/authorize response status", r.status); return r.json(); }) as WorkspaceResponse
        
        console.log("[publish] /bot/authorize response", auth);

        if (!auth || !auth.current_key)
            await say("Authorization Failed. Please set a new API key token (create from the web dashboard) using the `/set-token [token]` command.")

        console.log("[publish] calling /bot/publish");
        const data = await fetch(`${process.env.API_URL}/bot/publish`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${auth.current_key}`
            },
            body: JSON.stringify({
                team_id, channel_id, message_id
            })
        })
            .then((r) => { console.log("[publish] /bot/publish response status", r.status); return r.json(); }) as NewPostResponse

        console.log("[publish] /bot/publish response data", data);

        if (!data)
            await say("An error occured. Please re-run the command.");
        else if (data.ok !== true)
            await say("Failed to create post. Please re-run the command.");
        else
            await say({
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: [
                                `:white_check_mark: Your post has been published successfully.`,
                                ``,
                                `- View it from your posts page: https://sloogle.com/posts`,
                                `- Or using the \`/my-posts\` command.`,
                            ].join("\n")
                        }
                    }
                ]
            });
    });
}