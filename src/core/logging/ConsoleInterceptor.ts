/**
 * 🔧 Console Interceptor - Intercepta y reemplaza console.* calls
 *
 * Este interceptor:
 * 1. Reemplaza console.log/error/warn con nuestro Logger
 * 2. Mantiene funcionalidad en desarrollo
 * 3. Oculta logs en producción
 * 4. Permite migración gradual sin cambiar código existente
 */

import { logger } from "./LoggerService";

// Guardar referencias originales
const originalConsole = {
  log: console.log.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
};

// Flag para evitar loops infinitos
let isInterceptorActive = false;

/**
 * 🔄 Interceptor de console.log
 */
const interceptConsoleLog = (...args: any[]) => {
  if (isInterceptorActive) {
    return originalConsole.log(...args);
  }

  isInterceptorActive = true;

  try {
    // Extraer mensaje y datos
    const message = typeof args[0] === "string" ? args[0] : "Console log";
    const data = args.length > 1 ? args.slice(1) : args[0];

    // Usar nuestro logger
    logger.info(`[Console.log] ${message}`, data, {
      component: "Console",
    });
  } catch (error) {
    // Fallback a console original
    originalConsole.log(...args);
  } finally {
    isInterceptorActive = false;
  }
};

/**
 * 🔄 Interceptor de console.error
 */
const interceptConsoleError = (...args: any[]) => {
  if (isInterceptorActive) {
    return originalConsole.error(...args);
  }

  isInterceptorActive = true;

  try {
    // Extraer mensaje y error
    const message = typeof args[0] === "string" ? args[0] : "Console error";
    const errorData = args.length > 1 ? args.slice(1) : args[0];

    // Usar nuestro logger
    logger.error(`[Console.error] ${message}`, errorData, {
      component: "Console",
    });
  } catch (error) {
    // Fallback a console original
    originalConsole.error(...args);
  } finally {
    isInterceptorActive = false;
  }
};

/**
 * 🔄 Interceptor de console.warn
 */
const interceptConsoleWarn = (...args: any[]) => {
  if (isInterceptorActive) {
    return originalConsole.warn(...args);
  }

  isInterceptorActive = true;

  try {
    // Extraer mensaje y datos
    const message = typeof args[0] === "string" ? args[0] : "Console warning";
    const data = args.length > 1 ? args.slice(1) : args[0];

    // Usar nuestro logger
    logger.warn(`[Console.warn] ${message}`, data, {
      component: "Console",
    });
  } catch (error) {
    // Fallback a console original
    originalConsole.warn(...args);
  } finally {
    isInterceptorActive = false;
  }
};

/**
 * 🔄 Interceptor de console.info
 */
const interceptConsoleInfo = (...args: any[]) => {
  if (isInterceptorActive) {
    return originalConsole.info(...args);
  }

  isInterceptorActive = true;

  try {
    // Extraer mensaje y datos
    const message = typeof args[0] === "string" ? args[0] : "Console info";
    const data = args.length > 1 ? args.slice(1) : args[0];

    // Usar nuestro logger
    logger.info(`[Console.info] ${message}`, data, {
      component: "Console",
    });
  } catch (error) {
    // Fallback a console original
    originalConsole.info(...args);
  } finally {
    isInterceptorActive = false;
  }
};

/**
 * 🔄 Interceptor de console.debug
 */
const interceptConsoleDebug = (...args: any[]) => {
  if (isInterceptorActive) {
    return originalConsole.debug(...args);
  }

  isInterceptorActive = true;

  try {
    // Extraer mensaje y datos
    const message = typeof args[0] === "string" ? args[0] : "Console debug";
    const data = args.length > 1 ? args.slice(1) : args[0];

    // Usar nuestro logger
    logger.debug(`[Console.debug] ${message}`, data, {
      component: "Console",
    });
  } catch (error) {
    // Fallback a console original
    originalConsole.debug(...args);
  } finally {
    isInterceptorActive = false;
  }
};

/**
 * 🚀 Activar interceptores
 */
export const setupConsoleInterceptors = (): void => {
  console.log = interceptConsoleLog;
  console.error = interceptConsoleError;
  console.warn = interceptConsoleWarn;
  console.info = interceptConsoleInfo;
  console.debug = interceptConsoleDebug;

  // Log inicial usando el logger original para evitar loops
  originalConsole.info(
    "🔧 Console interceptors activados - Todos los console.* ahora usan LoggerService"
  );
};

/**
 * 🧹 Desactivar interceptores (útil para testing)
 */
export const restoreConsole = (): void => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;

  originalConsole.info(
    "🧹 Console interceptors desactivados - Restaurado console original"
  );
};

/**
 * 📊 Verificar si los interceptores están activos
 */
export const areInterceptorsActive = (): boolean => {
  return console.log === interceptConsoleLog;
};

/**
 * 🔧 Acceso a console original (para casos especiales)
 */
export const originalConsoleAPI = originalConsole;

export default {
  setupConsoleInterceptors,
  restoreConsole,
  areInterceptorsActive,
  originalConsoleAPI,
};
