import { } from 'mdb-react-ui-kit';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div >
        <div >

          <div className='icon'>
            <a href="https://github.com/Stegonyrob/agora_frontend.git" className={styles.icon} target="_blank" rel="noreferrer">
              <i className="bi bi-github"></i>
            </a>
            <a href="https://www.tiktok.com" className={styles.icon} target="_blank" rel="noreferrer" >
              <i className="bi bi-tiktok"></i>
            </a>
            <a href="https://www.facebook.com" className={styles.icon} target="_blank" rel="noreferrer" >
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com" className={styles.icon} target="_blank" rel="noreferrer">
              <i className="bi bi-instagram"></i>
            </a>
          </div>

          <p className={styles.text} >
            © 2024 Copyright: Ágora Centro Educativo de Apoyo Especializado

            <a href="#"></a>

          </p>

        </div>
      </div>
    </footer>


  );
}