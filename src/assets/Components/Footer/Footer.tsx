import LogoNavBar from '../Logo/LogoNavBar';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footerSection}>
      <div className={styles.container}>
        {/* CTA Section */}
        <div className={styles.footerCta}>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.singleCta}>
                <i className="fas fa-map-marker-alt"></i>
                <div className={styles.ctaText}>
                  <h4>Encuéntranos</h4>
                  <span>Calle Nicaragua 16, Gijón-Oeste, 33213, Gijón, Asturias, España</span>
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.singleCta}>
                <i className="fas fa-phone"></i>
                <div className={styles.ctaText}>
                  <h4>Llámanos</h4>
                  <span>+34 693 54 59 93</span>
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.singleCta}>
                <i className="far fa-envelope-open"></i>
                <div className={styles.ctaText}>
                  <h4>Email</h4>
                  <span>
                    <a href="mailto:centroeducativoagora@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                      centroeducativoagora@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Content */}
        <div className={styles.footerContent}>
          <div className={styles.row}>
            {/* Logo y descripción */}
            <div className={styles.colLogo}>
              <div className={styles.footerLogo}>
                <LogoNavBar />
              </div>
              <div className={styles.footerText}>
                <p>
                  Centro educativo de apoyo especializado en Gijón. Brindamos atención personalizada y profesionales a las personas con diversidad funcional.
                </p>
              </div>
              <div className={styles.footerSocialIcon}>
                <span>Síguenos</span>
                <a href="https://www.facebook.com/ceagorin" className={`${styles.footerIcon} facebook-bg`} target="_blank" rel="noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://x.com/agora_educativo" className={`${styles.footerIcon} twitter-bg`} target="_blank" rel="noreferrer">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://www.instagram.com/ceagorin/" className={`${styles.footerIcon} google-bg`} target="_blank" rel="noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://github.com/Stegonyrob/agora_frontend.git" className={styles.footerIcon} target="_blank" rel="noreferrer">
                  <i className="bi bi-github"></i>
                </a>
                <a href="http://www.youtube.com/@agoracentroeducativo191" className={styles.footerIcon} target="_blank" rel="noreferrer">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
            {/* Enlaces útiles */}
            <div className={styles.colLinks}>
              <div className={styles.footerWidgetHeading}>
                <h3>Enlaces útiles</h3>
              </div>
              <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/Agora">Ágora</a></li>
                <li><a href="/Services">Servicios</a></li>
                <li><a href="/Events">Eventos</a></li>
                <li><a href="/Cea">CEA/TEA</a></li>
                <li><a href="/Tda_Tdh">Tda/Tdh</a></li>
                <li><a href="/LearningDifficulties">Dificultades de Aprendizaje</a></li>
                <li><a href="/Communication">Transtornos de la Comunicación</a></li>
                <li><a href="/DevelopmentConditions">Condiciones del Desarrollo</a></li>
                <li><a href="/AboutMe">Sobre mí</a></li>
                <li><a href="/Blog">Blog</a></li>


              </ul>
            </div>
            {/* Horario */}
            <div className={styles.colHorario}>
              <div className={styles.footerWidgetHeading}>
                <h3>Horario</h3>
              </div>
              <div className={styles.footerText}>
                <p>Lunes a Viernes: 15:00 a 21:00</p>
                <p>Sábado: 10:00 a 14:00</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className={styles.copyrightArea}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.colCopyright}>
                <div className={styles.copyrightText}>
                  <p>
                    © 2025 Ágora Centro Educativo de Apoyo Especializado
                  </p>
                </div>
              </div>
              <div className={styles.colMenu}>
                <div className={styles.footerMenu}>
                  <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/legal/terms">Términos</a></li>
                    <li><a href="/legal/privacy">Privacidad</a></li>
                    <li><a href="/legal/cookies">Política de cookies</a></li>



                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}