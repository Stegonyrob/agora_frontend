// ============================================
// CONFIGURACIÓN DE SERVICIOS
// ============================================

// Config Service - Gestión centralizada de configuración
interface ConfigService {
  apiBaseUrl: string;
  recaptchaSiteKey: string;
  googleMapsApiKey: string;
  environment: 'development' | 'staging' | 'production';
  appName: string;
  appVersion: string;
}

// Configuración para repositorio PÚBLICO (demo)
const publicConfig: ConfigService = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'demo_key',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo_key',
  environment: (import.meta.env.VITE_APP_ENV as any) || 'development',
  appName: import.meta.env.VITE_APP_NAME || 'Ágora Demo',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

// Configuración para repositorio PRIVADO (producción)
// Esta será reemplazada en el repo privado
const privateConfig: ConfigService = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.agoracentroeducativo.com/api',
  recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  environment: (import.meta.env.VITE_APP_ENV as any) || 'production',
  appName: import.meta.env.VITE_APP_NAME || 'Ágora Centro Educativo',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

// Detectar automáticamente el entorno
const isProduction = import.meta.env.MODE === 'production';
const isDevelopment = import.meta.env.MODE === 'development';

// Exportar la configuración apropiada
export const config: ConfigService = isProduction ? privateConfig : publicConfig;

// Helper para logging (solo en desarrollo)
export const shouldLog = isDevelopment || import.meta.env.VITE_ENABLE_DEBUG === 'true';

// Helper para analytics (solo en producción)
export const shouldEnableAnalytics = isProduction && import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

// Validar configuración al iniciar
if (!config.apiBaseUrl) {
  console.error('⚠️ VITE_API_BASE_URL no está configurada');
}

export default config;
