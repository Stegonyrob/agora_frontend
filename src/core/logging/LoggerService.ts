/**
 * 📝 Logger Service - Sistema de Logging Profesional
 *
 * Este servicio reemplaza todos los console.log/error/warn del código para:
 * 1. Controlar qué se muestra según el ambiente (dev/prod)
 * 2. Formatear logs de manera consistente
 * 3. Ocultar información sensible en producción
 * 4. Permitir diferentes niveles de logging
 * 5. Enviar errores críticos a servicios de monitoreo
 */

// Niveles de logging
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

// Configuración por ambiente
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemoteLogging: boolean;
  maskSensitiveData: boolean;
  maxLogSize: number;
}

// Configuraciones por ambiente
const getEnvironmentConfig = (): LoggerConfig => {
  const env = import.meta.env.NODE_ENV || "development";

  // Configuración desde variables de entorno
  const envConfig: LoggerConfig = {
    level:
      LogLevel[import.meta.env.VITE_LOG_LEVEL as keyof typeof LogLevel] ??
      LogLevel.DEBUG,
    enableConsole: import.meta.env.VITE_ENABLE_CONSOLE_LOGS === "true",
    enableRemoteLogging: import.meta.env.VITE_ENABLE_REMOTE_LOGGING === "true",
    maskSensitiveData: import.meta.env.VITE_MASK_SENSITIVE_DATA === "true",
    maxLogSize: parseInt(import.meta.env.VITE_MAX_LOG_SIZE || "1000", 10),
  };

  // Configuraciones predeterminadas por ambiente
  const defaultConfigs: { [key: string]: LoggerConfig } = {
    development: {
      level: LogLevel.DEBUG,
      enableConsole: true,
      enableRemoteLogging: false,
      maskSensitiveData: false,
      maxLogSize: 1000,
    },
    production: {
      level: LogLevel.WARN,
      enableConsole: false,
      enableRemoteLogging: true,
      maskSensitiveData: true,
      maxLogSize: 200,
    },
    testing: {
      level: LogLevel.ERROR,
      enableConsole: false,
      enableRemoteLogging: false,
      maskSensitiveData: true,
      maxLogSize: 100,
    },
  };

  // Usar configuración de entorno si está definida, sino usar predeterminada
  const defaultConfig = defaultConfigs[env] || defaultConfigs.development;

  return {
    level: envConfig.level ?? defaultConfig.level,
    enableConsole: envConfig.enableConsole ?? defaultConfig.enableConsole,
    enableRemoteLogging:
      envConfig.enableRemoteLogging ?? defaultConfig.enableRemoteLogging,
    maskSensitiveData:
      envConfig.maskSensitiveData ?? defaultConfig.maskSensitiveData,
    maxLogSize: envConfig.maxLogSize ?? defaultConfig.maxLogSize,
  };
};

// Datos sensibles que deben ser enmascarados
const SENSITIVE_KEYS = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "secret",
  "key",
  "authorization",
  "credential",
  "auth",
  "session",
  "cookie",
  "csrf_token",
  "email",
  "useremail",
  "phone",
  "address",
  "ssn",
  "cardNumber",
];

// Interface para el contexto del log
interface LogContext {
  component?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  timestamp?: number;
  userAgent?: string;
  url?: string;
}

class LoggerService {
  private static instance: LoggerService;
  private config: LoggerConfig;
  private logBuffer: any[] = [];
  private environment: string;

  private constructor() {
    this.environment = import.meta.env.NODE_ENV || "development";
    this.config = getEnvironmentConfig();

    // Inicializar buffer para logs remotos
    this.initializeRemoteLogging();
  }

  /**
   * 🔧 Singleton pattern
   */
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  /**
   * 🎭 Enmascara datos sensibles en objetos
   */
  private maskSensitiveData(data: any): any {
    if (!this.config.maskSensitiveData) {
      return data;
    }

    if (typeof data !== "object" || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.maskSensitiveData(item));
    }

    const masked = { ...data };

    for (const key in masked) {
      const lowerKey = key.toLowerCase();

      // Verificar si la clave es sensible
      if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
        if (typeof masked[key] === "string") {
          masked[key] = this.maskString(masked[key]);
        } else {
          masked[key] = "[MASKED]";
        }
      } else if (typeof masked[key] === "object") {
        masked[key] = this.maskSensitiveData(masked[key]);
      }
    }

    return masked;
  }

  /**
   * 🎭 Enmascara strings sensibles
   */
  private maskString(str: string): string {
    if (!str || str.length <= 4) {
      return "[MASKED]";
    }

    const visibleChars = Math.min(4, Math.floor(str.length * 0.2));
    const start = str.substring(0, visibleChars);
    const end = str.substring(str.length - visibleChars);

    return `${start}${"*".repeat(str.length - visibleChars * 2)}${end}`;
  }

  /**
   * 📏 Trunca logs largos para evitar spam
   */
  private truncateLog(data: any): any {
    const str = JSON.stringify(data);
    if (str.length <= this.config.maxLogSize) {
      return data;
    }

    return {
      ...data,
      _truncated: true,
      _originalSize: str.length,
      _maxSize: this.config.maxLogSize,
    };
  }

  /**
   * 🏷️ Crea contexto enriquecido para el log
   */
  private createLogContext(context?: Partial<LogContext>): LogContext {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: this.config.maskSensitiveData
        ? "[MASKED]"
        : navigator.userAgent,
      sessionId: sessionStorage.getItem("sessionId") || "anonymous",
      userId: this.config.maskSensitiveData
        ? "[MASKED]"
        : sessionStorage.getItem("userId") || undefined,
      ...context,
    };
  }

  /**
   * 📊 Formatea el log para consola
   */
  private formatConsoleLog(
    level: LogLevel,
    message: string,
    data?: any,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level].padEnd(8);
    const component = context?.component ? `[${context.component}]` : "";

    return `🕐 ${timestamp} | ${levelStr} | ${component} ${message}`;
  }

  /**
   * 📤 Inicializar logging remoto
   */
  private initializeRemoteLogging(): void {
    if (!this.config.enableRemoteLogging) {
      return;
    }

    // Enviar logs críticos a servicio remoto
    window.addEventListener("beforeunload", () => {
      this.flushLogs();
    });

    // Enviar logs periódicamente
    setInterval(() => {
      this.flushLogs();
    }, 30000); // Cada 30 segundos
  }

  /**
   * 📤 Envía logs al servicio remoto
   */
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return;
    }

    try {
      const logs = [...this.logBuffer];
      this.logBuffer = [];

      // En un entorno real, esto enviaría a un servicio como LogRocket, Sentry, etc.
      if (import.meta.env.VITE_LOGGING_ENDPOINT) {
        await fetch(import.meta.env.VITE_LOGGING_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logs,
            environment: this.environment,
            timestamp: Date.now(),
          }),
        });
      }
    } catch (error) {
      // No usar el logger aquí para evitar loops infinitos
      if (this.config.enableConsole) {
        console.error("Failed to send logs to remote service:", error);
      }
    }
  }

  /**
   * 📝 Método genérico de logging
   */
  private log(
    level: LogLevel,
    message: string,
    data?: any,
    context?: Partial<LogContext>
  ): void {
    // Verificar si el nivel está habilitado
    if (level < this.config.level) {
      return;
    }

    const logContext = this.createLogContext(context);
    const maskedData = data ? this.maskSensitiveData(data) : undefined;
    const truncatedData = maskedData ? this.truncateLog(maskedData) : undefined;

    // Log a consola si está habilitado
    if (this.config.enableConsole) {
      const formattedMessage = this.formatConsoleLog(
        level,
        message,
        truncatedData,
        logContext
      );

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, truncatedData);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, truncatedData);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, truncatedData);
          break;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          console.error(formattedMessage, truncatedData);
          break;
      }
    }

    // Agregar al buffer para logging remoto
    if (this.config.enableRemoteLogging && level >= LogLevel.WARN) {
      this.logBuffer.push({
        level: LogLevel[level],
        message,
        data: truncatedData,
        context: logContext,
      });

      // Si es crítico, enviar inmediatamente
      if (level >= LogLevel.CRITICAL && this.logBuffer.length > 0) {
        this.flushLogs().catch(() => {
          // Silenciosamente fallar
        });
      }
    }
  }

  /**
   * 🐛 Debug logs - Solo en desarrollo
   */
  public debug(
    message: string,
    data?: any,
    context?: Partial<LogContext>
  ): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * ℹ️ Info logs - Información general
   */
  public info(
    message: string,
    data?: any,
    context?: Partial<LogContext>
  ): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * ⚠️ Warning logs - Advertencias
   */
  public warn(
    message: string,
    data?: any,
    context?: Partial<LogContext>
  ): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * ❌ Error logs - Errores
   */
  public error(
    message: string,
    error?: any,
    context?: Partial<LogContext>
  ): void {
    const errorData =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: this.config.maskSensitiveData ? "[MASKED]" : error.stack,
          }
        : error;

    this.log(LogLevel.ERROR, message, errorData, context);
  }

  /**
   * 🚨 Critical logs - Errores críticos
   */
  public critical(
    message: string,
    error?: any,
    context?: Partial<LogContext>
  ): void {
    const errorData =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: this.config.maskSensitiveData ? "[MASKED]" : error.stack,
          }
        : error;

    this.log(LogLevel.CRITICAL, message, errorData, context);
  }

  /**
   * 🔄 Métodos para migración gradual desde console.*
   */
  public legacyLog(...args: any[]): void {
    this.info("Legacy console.log", { args });
  }

  public legacyError(...args: any[]): void {
    this.error("Legacy console.error", { args });
  }

  public legacyWarn(...args: any[]): void {
    this.warn("Legacy console.warn", { args });
  }

  /**
   * 🧹 Limpiar logs (útil para testing)
   */
  public clear(): void {
    this.logBuffer = [];
  }

  /**
   * ⚙️ Configurar logger en tiempo de ejecución
   */
  public configure(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 📊 Obtener estadísticas del logger
   */
  public getStats(): {
    bufferSize: number;
    environment: string;
    config: LoggerConfig;
  } {
    return {
      bufferSize: this.logBuffer.length,
      environment: this.environment,
      config: { ...this.config },
    };
  }
}

// Exportar instancia singleton
export const logger = LoggerService.getInstance();

// Exportar funciones directas para facilidad de uso
export const log = {
  debug: (message: string, data?: any, context?: Partial<LogContext>) =>
    logger.debug(message, data, context),
  info: (message: string, data?: any, context?: Partial<LogContext>) =>
    logger.info(message, data, context),
  warn: (message: string, data?: any, context?: Partial<LogContext>) =>
    logger.warn(message, data, context),
  error: (message: string, error?: any, context?: Partial<LogContext>) =>
    logger.error(message, error, context),
  critical: (message: string, error?: any, context?: Partial<LogContext>) =>
    logger.critical(message, error, context),
};

export default logger;
