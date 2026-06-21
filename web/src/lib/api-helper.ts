export interface WorkspaceRespone {
    id: string
    name: string
    domain: string
    icon: string
}

export interface ChannelResponse {
    id: string
    name: string
    topic: string
    purpose: string
    is_private: boolean
    is_archived: boolean
    member_count: number
    created: Date
}

interface SlackFile {
    id: string
    name: string
    title: string
    mimetype: string
    url_private: string
    size: number
}
interface SlackAttachment {
    id: number
    title: string
    fallback: string
    image_url?: string
    thumb_url?: string
}
export interface MessageResponse {
    ts: string
    channel: string
    user: string
    text: string
    files?: SlackFile[]
    attachments?: SlackAttachment[]
    thread_ts?: string
    reply_count?: number
    reactions?: { name: string; count: number; users: string[] }[]
}

export interface PostDetail {
    id: string
    message_id: string
    channel_id: string
    team_id: string
    userId: string
    deleteAfter: string | null
    createdAt: string
    updatedAt: string
    workspace: WorkspaceRespone | null
    channel: ChannelResponse | null
    message: {
        text_preview: string | null
        user: string
        ts: string
        thread_ts?: string
        reply_count?: number
        file_names: string[]
    } | null
}

export async function getWorkspace(team_id: string) {
    const res = await fetch(`${process.env.BOT_API_URL}/workspace?team_id=${team_id}`)
    if (res.ok) {
        const data: { workspace: WorkspaceRespone } = await res.json();

        return data.workspace;
    }
}

export async function getChannel(channel_id: string) {
    const res = await fetch(`${process.env.BOT_API_URL}/channel?channel_id=${channel_id}`)
    if (res.ok) {
        const data: { channel: ChannelResponse } = await res.json();

        return data.channel;
    }
}

export async function getMessage(channel_id: string, ts: string) {
    const res = await fetch(`${process.env.BOT_API_URL}/message?channel_id=${channel_id}&ts=${ts}`)
    if (res.ok) {
        const data: { message: MessageResponse } = await res.json();

        return data.message;
    }
}