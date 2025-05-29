import { useEffect, useRef } from 'react';
import logo from './logolargoblanco-removebg-preview.png';
import './LogoSimply.scss';
interface LogoProps {
    className?: string;
}
const LogoNavBar: React.FC<LogoProps> = ({ className, ...props }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');


    }, []);

    return (
        <div className={className}>
            <img className={className} src={logo} alt="Logo" />

        </div>
    );
};

export default LogoNavBar;