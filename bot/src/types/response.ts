export interface KeyStatusResponse {
    valid: boolean
    user?: {
        id?: string
        name?: string;
    }[];
}

export interface WorkspaceResponse {
    id: string;
    team_id: string;
    current_key: string;
    autopublish_channels: string[] | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface NewPostResponse {
    ok: boolean
    post: {
        id: string
        message_id: string
        channel_id: string
        team_id: string
        userId: string
        deleteAfter: Date
        createdAt: Date
        updatedAt: Date
    }
}