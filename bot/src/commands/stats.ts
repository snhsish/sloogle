import { App } from "@slack/bolt";
import os from "node:os";

export function statsCommand(app: App) {
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
}