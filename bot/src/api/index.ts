import express, { type Express } from "express";
import { App } from "@slack/bolt";
import { workspacesRoutes } from "./routes/workspace";
import { channelsRoutes } from "./routes/channel";
import { messagesRoutes } from "./routes/message";

export function createApi(bolt: App): Express {
    const api = express();
    api.use(workspacesRoutes(bolt));
    api.use(channelsRoutes(bolt));
    api.use(messagesRoutes(bolt));
    return api;
}