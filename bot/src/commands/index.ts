import { App } from "@slack/bolt";

import { setTokenCommand } from "./set-token";
import { statsCommand } from "./stats";
import { publishCommand } from "./publish";

export function registerCommands(app: App) {
    setTokenCommand(app);
    statsCommand(app);
    publishCommand(app)
}