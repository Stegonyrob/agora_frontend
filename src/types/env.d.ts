/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_ENDPOINT_GENERAL: string;
  readonly VITE_API_ENDPOINT_POSTS: string;
  readonly VITE_API_ENDPOINT_USERS: string;
  readonly VITE_API_ENDPOINT_IMAGES: string;
  readonly VITE_API_ENDPOINT_EVENTS: string;
  readonly VITE_API_ENDPOINT_EVENT_IMAGES: string;
  readonly VITE_API_ENDPOINT_REPLIES: string;
  readonly VITE_API_ENDPOINT_TAGS: string;
  readonly VITE_API_ENDPOINT_LOGIN: string;
  readonly VITE_API_ENDPOINT_REGISTER: string;
  readonly VITE_API_ENDPOINT_BASE: string;
  readonly VITE_API_ENDPOINT_PROFILE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
