import { } from 'mdb-react-ui-kit';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className=" footer">
      <div >
        <div >

          <div className='icon'>
            <a href="https://github.com/Stegonyrob/agora_frontend.git" className="icon" target="_blank" rel="noreferrer">
              <i className="bi bi-github"></i>
            </a>
            <a href="https://www.tiktok.com" className="icon" target="_blank" rel="noreferrer" >
              <i className="bi bi-tiktok"></i>
            </a>
            <a href="https://www.facebook.com" className="icon" target="_blank" rel="noreferrer" >
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com" className="icon" target="_blank" rel="noreferrer">
              <i className="bi bi-instagram"></i>
            </a>
          </div>

          <p className="text" >
            © 2024 Copyright: Ágora Centro Educativo de Apoyo Especializado
            <a href="#"></a>
          </p>

        </div>
      </div>
    </footer>


  );
}