import { useEffect, useRef } from 'react';
import logo from './agoraLogoTras.png';
import style from './Logo.module.scss';

const Logo = () => {
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
      context?.fillText('Click Me!!!', offsetX, offsetY);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const handleBodyMouseMove = (event: MouseEvent) => {
      setTimeout(() => {
        let circle = document.createElement('span');
        let x = event.clientX;
        let y = event.clientY;
        circle.className = style.circle;
        circle.style.left = x + "px";
        circle.style.top = y + "px";
        let size = Math.random() * 100;
        circle.style.width = 1 + size + "px";
        circle.style.height = 1 + size + "px";
        document.body.appendChild(circle);
        setTimeout(function () {
          circle.remove();
        }, 3800);
      }, 100);
    };

    document.body.addEventListener('mousemove', handleBodyMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mousemove', handleBodyMouseMove);
    };
  }, []);

  return (
    <div className={style.logoContainer}>
      <img className={style.logoImageHome} src={logo} alt="Logo" />
      <canvas
        ref={canvasRef}

        className={style.logoCanvas}
      />
    </div>
  );
};

export default Logo;