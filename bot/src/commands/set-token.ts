import { App } from "@slack/bolt";

export function setTokenCommand(app: App) {
    app.command("/set-token", async ({ command, ack, say }) => {
        await ack();
        const token = command.text.trim();
    
        const data = await fetch(`${process.env.API_URL}/bot/set-token`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                team_id: command.team_id
            })
        })
            .then((r) => r.json()) as { success: boolean }
    
        if (!data)
            await say("Invalid token. Create a new API key from https://sloogle.com/configure and paste it with the `/set-token [token]` command.");
        else if (data.success !== true)
            await say("Failed to set token. Please retry after a while.");
        else
            await say({
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: [
                                `:white_check_mark: API key has been configured successfully`,
                                ``,
                                `You can now publish new messages as posts (from channels I have access to):`,
                                `- Using the \`/publish [message-id/message-url]\` slash command`,
                                `- Or directly from the web dashboard, from the \`/posts\` page.`
                            ].join("\n")
                        }
                    }
                ]
            });
    });
}