import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BlogRules from '../Components/Legal/BlogRules';
import styles from './scss/Views.module.scss';

export default function CommunityRulesView() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <Container>
                <div className={styles.rulesPageHeader}>
                    <Button
                        variant="outline-secondary"
                        onClick={handleGoBack}
                        className={styles.backButton}
                    >
                        ← Volver
                    </Button>
                </div>

                <BlogRules />

                <div className={styles.rulesPageFooter}>
                    <p className={styles.lastUpdated}>
                        Última actualización: {new Date().toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>

                    <div className={styles.contactInfo}>
                        <h4>¿Tienes preguntas sobre nuestras reglas?</h4>
                        <p>
                            Si tienes alguna duda sobre estas reglas o necesitas ejercer tus derechos
                            conforme al RGPD, puedes contactarnos a través de:
                        </p>
                        <ul>
                            <li>Email: soporte@agora-comunidad.com</li>
                            <li>Formulario de contacto en la plataforma</li>
                        </ul>
                    </div>
                </div>
            </Container>
        </div>
    );
}
