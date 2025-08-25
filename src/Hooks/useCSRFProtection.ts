/**
 * 🛡️ useCSRFProtection Hook
 *
 * Hook personalizado que proporciona protección CSRF automática para formularios.
 *
 * ¿Por qué usar este hook?
 * 1. Simplifica la implementación de CSRF en formularios
 * 2. Asegura que todos los formularios tengan protección
 * 3. Maneja automáticamente la renovación de tokens
 * 4. Proporciona validación de origen
 */

import { useCallback, useEffect, useState } from "react";
import csrfService from "../core/auth/CSRFService";

interface CSRFHookResult {
  /** Token CSRF actual */
  csrfToken: string;
  /** Objeto con el token para incluir en formularios */
  csrfFormData: { [key: string]: string };
  /** Headers para requests AJAX */
  csrfHeaders: Record<string, string>;
  /** Función para validar un token */
  validateToken: (token: string) => boolean;
  /** Función para rotar el token */
  rotateToken: () => void;
  /** Función para validar origen de la solicitud */
  validateOrigin: (origin: string) => boolean;
  /** Estado de loading del token */
  isLoading: boolean;
}

interface UseCSRFProtectionOptions {
  /** Orígenes permitidos para solicitudes CSRF */
  allowedOrigins?: string[];
  /** Si debe rotar el token automáticamente */
  autoRotate?: boolean;
  /** Intervalo de rotación automática en ms */
  rotateInterval?: number;
}

export const useCSRFProtection = (
  options: UseCSRFProtectionOptions = {}
): CSRFHookResult => {
  const {
    allowedOrigins = [
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
      window.location.origin,
    ],
    autoRotate = false,
    rotateInterval = 10 * 60 * 1000, // 10 minutos
  } = options;

  const [csrfToken, setCsrfToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * 🔄 Actualiza el token CSRF
   */
  const updateToken = useCallback(() => {
    try {
      const newToken = csrfService.getToken();
      setCsrfToken(newToken);
      setIsLoading(false);
    } catch (error) {
      console.error("💥 useCSRFProtection: Error actualizando token:", error);
      setIsLoading(false);
    }
  }, []);

  /**
   * 🔄 Rota el token CSRF
   */
  const rotateToken = useCallback(() => {
    try {
      const newToken = csrfService.rotateToken();
      setCsrfToken(newToken);
    } catch (error) {
      console.error("💥 useCSRFProtection: Error rotando token:", error);
    }
  }, []);

  /**
   * ✅ Valida un token CSRF
   */
  const validateToken = useCallback((token: string): boolean => {
    try {
      return csrfService.validateToken(token);
    } catch (error) {
      console.error("💥 useCSRFProtection: Error validando token:", error);
      return false;
    }
  }, []);

  /**
   * 🌐 Valida el origen de una solicitud
   */
  const validateOrigin = useCallback(
    (origin: string): boolean => {
      try {
        return csrfService.validateOrigin(origin, allowedOrigins);
      } catch (error) {
        console.error("💥 useCSRFProtection: Error validando origen:", error);
        return false;
      }
    },
    [allowedOrigins]
  );

  /**
   * 🚀 Efecto de inicialización
   */
  useEffect(() => {
    updateToken();
  }, [updateToken]);

  /**
   * ⏰ Efecto de rotación automática
   */
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      rotateToken();
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, rotateToken]);

  /**
   * 📱 Efecto para limpiar token al desmontar
   */
  useEffect(() => {
    return () => {
      // No limpiar el token al desmontar porque otros componentes podrían usarlo
      // Solo limpiarlo en logout explícito
    };
  }, []);

  // Always return a CSRFHookResult object
  return {
    csrfToken,
    csrfFormData: csrfService.getTokenForForm(),
    csrfHeaders: csrfService.getTokenHeaders(),
    validateToken,
    rotateToken,
    validateOrigin,
    isLoading,
  };
};

export default useCSRFProtection;
