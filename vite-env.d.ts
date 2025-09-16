/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  // Base API
  readonly VITE_API_ENDPOINT_GENERAL: string;

  // Auth endpoints
  readonly VITE_API_ENDPOINT_LOGIN: string;
  readonly VITE_API_ENDPOINT_LOGOUT: string;
  readonly VITE_API_ENDPOINT_REFRESH_TOKEN: string;

  // Password recovery
  readonly VITE_API_ENDPOINT_USER_PASSWORD_RECOVERY_REQUEST: string;
  readonly VITE_API_ENDPOINT_USER_PASSWORD_RESET: string;
  readonly VITE_API_ENDPOINT_ADMIN_PASSWORD_RECOVERY_REQUEST: string;
  readonly VITE_API_ENDPOINT_ADMIN_PASSWORD_RESET: string;

  // Users and Profiles - OPTIMIZED
  readonly VITE_API_ENDPOINT_USERS: string;
  readonly VITE_API_ENDPOINT_REGISTER: string;
  readonly VITE_API_ENDPOINT_AVATARS: string;

  // Profile endpoints - UNIFIED AND OPTIMIZED
  readonly VITE_API_ENDPOINT_PROFILE_BASE: string;
  readonly VITE_API_ENDPOINT_PROFILE_GET_BY_ID: string;
  readonly VITE_API_ENDPOINT_PROFILE_UPDATE_BY_ID: string;
  readonly VITE_API_ENDPOINT_PROFILE_DELETE_BY_ID: string;
  readonly VITE_API_ENDPOINT_PROFILE_ME_UPDATE: string;
  readonly VITE_API_ENDPOINT_PROFILE_ME_DELETE: string;
  readonly VITE_API_ENDPOINT_PROFILE_FAVORITES: string;

  // Admin endpoints - COMPLETO SEGÚN SWAGGER
  readonly VITE_API_ENDPOINT_ADMIN_BASE: string;
  readonly VITE_API_ENDPOINT_ADMIN_CREATE: string;
  readonly VITE_API_ENDPOINT_ADMIN_LIST: string;
  readonly VITE_API_ENDPOINT_ADMIN_LIST_ALT: string;
  readonly VITE_API_ENDPOINT_ADMIN_GET_BY_ID: string;
  readonly VITE_API_ENDPOINT_ADMIN_UPDATE: string;
  readonly VITE_API_ENDPOINT_ADMIN_DELETE: string;
  readonly VITE_API_ENDPOINT_ADMIN_DEMOTE: string;
  readonly VITE_API_ENDPOINT_ADMIN_PROFILE_BASE: string;
  readonly VITE_API_ENDPOINT_ADMIN_PROFILE_GET: string;
  readonly VITE_API_ENDPOINT_ADMIN_PROFILE_UPDATE: string;
  readonly VITE_API_ENDPOINT_ADMIN_PROFILE_DELETE: string;
  readonly VITE_API_ENDPOINT_ADMIN_PROFILE_ADMINS_GET: string;
  readonly VITE_API_ENDPOINT_ADMIN_PROFILE_ADMINS_POST: string;
  readonly VITE_API_ENDPOINT_ADMIN_2FA_SECRET: string;
  readonly VITE_API_ENDPOINT_ADMIN_2FA_VALIDATE: string;
  readonly VITE_API_ENDPOINT_BANNED: string;

  // Legal content
  readonly VITE_API_ENDPOINT_LEGAL: string;

  // Posts and content
  readonly VITE_API_ENDPOINT_POSTS: string;
  readonly VITE_API_ENDPOINT_POST_IMAGES: string;
  readonly VITE_API_ENDPOINT_REPLIES: string;
  readonly VITE_API_ENDPOINT_COMMENTS: string;
  readonly VITE_API_ENDPOINT_FAVORITE: string;

  // Tags system
  readonly VITE_API_ENDPOINT_TAGS: string;
  readonly VITE_API_ENDPOINT_TAGS_BY_EVENT_PUBLIC: string;
  readonly VITE_API_ENDPOINT_TAGS_BY_EVENT_PRIVATE: string;
  readonly VITE_API_ENDPOINT_TAGS_POST: string;
  readonly VITE_API_ENDPOINT_EVENT_TAGS: string;
  readonly VITE_API_ENDPOINT_POST_TAGS: string;

  // Media and resources
  readonly VITE_API_ENDPOINT_IMAGES: string;
  readonly VITE_API_ENDPOINT_TEXTS: string;

  // Events
  readonly VITE_API_ENDPOINT_EVENTS: string;
  readonly VITE_API_ENDPOINT_EVENTS_PUBLIC: string;
  readonly VITE_API_ENDPOINT_EVENT_IMAGES: string;
  readonly VITE_API_ENDPOINT_EVENT_IMAGES_PUBLIC: string;
  readonly VITE_API_ENDPOINT_ATTENDEES: string;

  // Additional services
  readonly VITE_API_ENDPOINT_HEALTH: string;
  readonly VITE_API_ENDPOINT_PUBLIC_SETTINGS: string;
  readonly VITE_API_ENDPOINT_MODERATION: string;
  readonly VITE_API_ENDPOINT_EXPORT: string;
  readonly VITE_API_ENDPOINT_ALERTS: string;
  readonly VITE_API_ENDPOINT_NOTIFICATIONS: string;

  // Social auth
  readonly VITE_API_ENDPOINT_GOOGLE_AUTH: string;
  readonly VITE_API_ENDPOINT_FACEBOOK_AUTH: string;

  // External services
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_SECRET: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;

  // Development
  readonly VITE_NODE_ENV: string;
  readonly VITE_DEBUG: string;

  // Logging
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_ENABLE_CONSOLE_LOGS: string;
  readonly VITE_ENABLE_REMOTE_LOGGING: string;
  readonly VITE_MASK_SENSITIVE_DATA: string;
  readonly VITE_MAX_LOG_SIZE: string;
  readonly VITE_LOGGING_ENDPOINT: string;
}
