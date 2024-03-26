import { } from 'mdb-react-ui-kit';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="text-white-50 text-center text-xlg-start position-fixed mt-5 bottom-0 w-100 footer">
     <div className="container p-4 pb-2">
      <div className="row-auto d-flex justify-content-between align-items-center">
        
           <div>
             <a href="https://github.com/Stegonyrob/agora_frontend.git" className="me-4 text-reset" target="_blank" rel="noreferrer">
               <i className="bi bi-github"></i>
             </a>
             <a href="https://www.tiktok.com" className="me-4 text-reset" target="_blank" rel="noreferrer" >
               <i className="bi bi-tiktok"></i>
             </a>
             <a href="https://www.facebook.com" className="me-4 text-reset" target="_blank" rel="noreferrer" >
               <i className="bi bi-facebook"></i>
             </a>
             <a href="https://www.instagram.com" className="me-4 text-reset" target="_blank" rel="noreferrer">
               <i className="bi bi-instagram"></i>
             </a>
           </div>
    
           <p className="text-center p-2" >
             © 2024 Copyright:Ágora Centro Educativo de Apoyo Especializado
             <a className="text-dark" href="#"></a>
           </p>
    
      </div>
     </div>
    </footer>

     
  );
}