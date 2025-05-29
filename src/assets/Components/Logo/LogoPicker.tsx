import { useEffect, useRef } from 'react';
import logo from './agorinnegro2.jpg';
import style from './LogoPicker.module.scss';

const LogoPicker = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      context?.clearRect(0, 0, canvas.width, canvas.height);
      if (context) context.font = '1.5rem Arial';
      if (context) context.fillStyle = 'white';
      context?.fillText('Click Me!', offsetX, offsetY);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Burbuja más lenta: aumenta el delay y la duración
    const handleBodyMouseMove = (event: MouseEvent) => {
      setTimeout(() => {
        let circle = document.createElement('span');
        let x = event.clientX;
        let y = event.clientY;
        circle.className = style.circle;
        circle.style.left = x + "px";
        circle.style.top = y + "px";
        let size = Math.random() * 80 + 20; // burbujas más uniformes
        circle.style.width = 1 + size + "px";
        circle.style.height = 1 + size + "px";
        document.body.appendChild(circle);
        setTimeout(function () {
          circle.remove();
        }, 6000); // burbuja más lenta (antes 3800)
      }, 300); // delay más largo (antes 100)
    };

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
      <span className={style.clickMe}>Click Me</span>
    </div>
  );
};

export default LogoPicker;