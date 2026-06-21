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

        console.log("here")

        if (!message_id)
            await say("Invalid parameter passed. Only a valid message ID or message URL is expected");

        if (!team_id || !channel_id)
            await say("Invalid workspace or unsupported channel");

        console.log("or here")

        const auth = await fetch(`${process.env.API_URL}/bot/authorize`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.BOT_SHARED_SECRET}`
            },
            body: JSON.stringify({
                team_id
            })
        })
            .then((r) => r.json()) as WorkspaceResponse
        
        console.log("not here ig", auth)

        if (!auth || !auth.current_key)
            await say("Authorization Failed. Please set a new API key token (create from the web dashboard) using the `/set-token [token]` command.")

        const data = await fetch(`${process.env.API_URL}/bot/publish`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${auth.current_key}`
            },
            body: JSON.stringify({
                team_id, channel_id, message_id
            })
        })
            .then((r) => r.json()) as NewPostResponse

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