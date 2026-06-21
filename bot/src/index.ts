import dotenv from "dotenv";
dotenv.config();

import { App, LogLevel } from "@slack/bolt";
import { createApi } from "./api";
import { registerCommands } from "./commands";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN!,
    logLevel: LogLevel.DEBUG
});
registerCommands(app); // registering slash commands

// api routes
const api = createApi(app);

app.event("app_mention", async ({ event, say }) => {
    await say({
        text: `Hello <@${event.user}>`,

    })
});

(async () => {
    await app.start(process.env.PORT || 3000).then(() =>
        console.log("BOT STARTED")
    );
    api.listen(4000, () =>
        console.log("API server on :4000")
    );
})();

