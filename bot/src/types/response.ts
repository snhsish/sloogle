export interface KeyStatusResponse {
    valid: boolean
    user?: {
        id?: string
        name?: string;
    }[];
}