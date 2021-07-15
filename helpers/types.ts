export interface ClientPost {
    title: string
    content: string
}

export interface Post extends ClientPost {
    id: string
    created_at: number
}

export type PostProp = {
    post: Post
}
