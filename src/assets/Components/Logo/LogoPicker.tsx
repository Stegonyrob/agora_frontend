import { useEffect, useRef } from 'react';
import logo from './agorinnegro2.jpg';
import style from './LogoPicker.module.scss';

const LogoPicker = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');

    let lastBubbleTime = 0;
    const BUBBLE_INTERVAL = 50;

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      context?.clearRect(0, 0, canvas.width, canvas.height);
      if (context) {
        context.font = '1.5rem Arial';
        context.fillStyle = 'white';
        context.fillText('Click Me!', offsetX, offsetY);
      }
    };

    const handleBodyMouseMove = (event: MouseEvent) => {
      const currentTime = Date.now();

      if (currentTime - lastBubbleTime > BUBBLE_INTERVAL) {
        let circle = document.createElement('span');

        // Obtiene las coordenadas del cursor
        const x = event.clientX;
        const y = event.clientY;

        // Aplica los estilos en línea, imitando el código original para asegurar el posicionamiento
        circle.style.position = "absolute";
        circle.style.pointerEvents = "none";
        circle.style.zIndex = "1000"; // Se asegura que la burbuja esté en la parte superior
        circle.style.left = 50 + x + "px";
        circle.style.top = 50 + y + "px";

        // La clave: Centra el elemento en las coordenadas del cursor
        circle.style.transform = "translate(-50%, -50%)";

        // Aplica los estilos para el tamaño y la forma
        let size = Math.random() * 100;
        circle.style.width = 20 + size + "px";
        circle.style.height = 20 + size + "px";
        circle.style.borderRadius = "50%";

        // Usa la clase de tu archivo SCSS para el resto de los estilos (animación y color)
        circle.className = style.circle;

        document.body.appendChild(circle);

        // Temporizador para eliminar la burbuja una vez que la animación haya terminado
        setTimeout(function () {
          circle.remove();
        }, 1800);

        lastBubbleTime = currentTime;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mousemove', handleBodyMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mousemove', handleBodyMouseMove);
    };
  }, []);

  return (
    <div className={style.logoPickerContainer}>
      <img className={style.logoPickerImage} src={logo} alt="Logo" />
      <canvas
        ref={canvasRef}
        className={style.logoPickerCanvas}
        width={320}
        height={320}
      />

    </div>
  );
};

export default LogoPicker;