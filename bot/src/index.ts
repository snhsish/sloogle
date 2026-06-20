import dotenv from "dotenv";
dotenv.config();

import { App, LogLevel } from "@slack/bolt";
import os from "node:os";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN!,
    logLevel: LogLevel.DEBUG
});

app.event("app_mention", async ({ event, say }) => {
    await say({
        text: `Hello <@${event.user}>`,

    })
});

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

    // console.log(data);

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

app.command("/stats", async ({ command, ack, say }) => {
    await ack();

    const startDate = Date.now();
    const uptime = process.uptime();
    const mem = process.memoryUsage();
    const cpus = os.cpus();

    const uptimeDays = Math.floor(uptime / 86400);
    const uptimeHours = Math.floor((uptime % 86400) / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);

    await say({
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: [
                        `*BOT STATS*`,
                        `Response Latency: \`${Date.now() - startDate}ms\``,
                        `Uptime: \`${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\``,
                        `Process Memory: \`${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB\` / \`${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB\``,
                        ` `,
                        `OS: \`${os.hostname()}\` (${os.type()} ${os.release()})`,
                        `OS Memory: \`${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB\` total, \`${(os.freemem() / 1024 / 1024 / 1024).toFixed(1)} GB\` free`,
                        `CPU: \`${cpus[0]?.model}\` (\`${cpus.length} cores\`)`,
                        `Load Avg: \`${os.loadavg().map(n => n.toFixed(2)).join(', ')}\``
                    ].join("\n")
                }
            }
        ]
    });
});

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log("BOT STARTED");
})();

