import { useEffect, useRef } from 'react';
import logo from './agoraLogo.png';
import './LogoSimply.scss';

const Logo = () => {
 const canvasRef = useRef<HTMLCanvasElement>(null);

 useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');

   

 }, []);

 return (
    <div className="logo-container">
      <img className="logo-image2" src={logo} alt="Logo" />
   
    </div>
 );
};

export default Logo;