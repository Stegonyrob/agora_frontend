/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_API_ENDPOINT_GENERAL: string
    readonly VITE_API_ENDPOINT_POSTS: string
    readonly VITE_API_ENDPOINT_USERS: string
    readonly VITE_API_ENDPOINT_IMAGES: string
    readonly VITE_API_ENDPOINT_REPLIES: string
    readonly VITE_API_ENDPOINT_TAGS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}