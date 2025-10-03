import React, { useState } from "react";

// Utilidad para redimensionar y convertir a hex
export async function resizeAndFileToHex(
    file: File,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const reader = new FileReader();
        reader.onload = (e) => {
            img.onload = () => {
                // Crear canvas y redimensionar
                const canvas = document.createElement("canvas");
                let { width, height } = img;
                if (width > maxWidth || height > maxHeight) {
                    const scale = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);
                // Comprimir a JPEG y obtener blob
                canvas.toBlob(async (blob) => {
                    if (!blob) return reject("No se pudo comprimir la imagen");
                    const arrayBuffer = await blob.arrayBuffer();
                    const byteArray = new Uint8Array(arrayBuffer);
                    const hex = Array.from(byteArray)
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                    resolve(hex);
                }, "image/jpeg", quality);
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

interface ImageCompressorToHexProps {
    file: File;
    onHexReady: (hex: string) => void;
    onError?: (err: string) => void;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

// Microcomponente: recibe un File, procesa y llama onHexReady con el string hex
export const ImageCompressorToHex: React.FC<ImageCompressorToHexProps> = ({
    file,
    onHexReady,
    onError,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7,
}) => {
    const [processing, setProcessing] = useState(true);
    React.useEffect(() => {
        let cancelled = false;
        setProcessing(true);
        resizeAndFileToHex(file, maxWidth, maxHeight, quality)
            .then((hex) => {
                if (!cancelled) {
                    onHexReady(hex);
                    setProcessing(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    onError?.(typeof err === "string" ? err : "Error al procesar imagen");
                    setProcessing(false);
                }
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);
    return processing ? <span>Procesando imagen...</span> : null;
};
