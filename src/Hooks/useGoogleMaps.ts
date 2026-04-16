import { useEffect, useState } from "react";

interface UseGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
  region?: string;
  language?: string;
}

interface GoogleMapsLoadResult {
  isLoaded: boolean;
  loadError: string | null;
  isLoading: boolean;
}

export const useGoogleMaps = (
  options: UseGoogleMapsOptions
): GoogleMapsLoadResult => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    apiKey,
    libraries = ["geometry", "places"],
    region = "ES",
    language = "es",
  } = options;

  useEffect(() => {
    // Verificar si Google Maps ya está cargado
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Verificar si ya hay un script de Google Maps cargándose
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      // Esperar a que se cargue el script existente
      setIsLoading(true);
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          setIsLoading(false);
          clearInterval(checkLoaded);
        }
      }, 100);

      return () => clearInterval(checkLoaded);
    }

    if (!apiKey) {
      setLoadError("API Key de Google Maps no proporcionada");
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    // Crear función de callback global
    const callbackName = "initGoogleMaps";
    (window as any)[callbackName] = () => {
      console.log("✅ Google Maps API cargada exitosamente");
      setIsLoaded(true);
      setIsLoading(false);
      delete (window as any)[callbackName];
    };

    // Crear y agregar el script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(
      ","
    )}&region=${region}&language=${language}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error("❌ Error cargando Google Maps API");
      setLoadError("Error al cargar Google Maps API");
      setIsLoading(false);
      delete (window as any)[callbackName];
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector(`script[src*="${apiKey}"]`);
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
      delete (window as any)[callbackName];
    };
  }, [apiKey, libraries, region, language]);

  return { isLoaded, loadError, isLoading };
};
