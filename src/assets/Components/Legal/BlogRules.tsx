import React, { useEffect, useState } from 'react';
import { LegalTextDTO } from '../../../core/legals/LegalTextDTO';
import { LegalTextService } from '../../../core/legals/LegalTextService';
import styles from './BlogRules.module.scss';
import LegalTextGeneric from './LegalTextGeneric';

const BlogRules: React.FC = () => {
    const [blogRules, setBlogRules] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBlogRules = async () => {
            try {
                setLoading(true);
                const legalTextService = new LegalTextService();
                const rulesData = await legalTextService.getLegalTextByType('blog-rules');
                setBlogRules(rulesData);
                setError(null);
            } catch (err) {
                console.error('Error loading blog rules:', err);
                setError('Error al cargar las reglas. Mostrando reglas por defecto.');
                // Set default rules if backend fails
                setBlogRules({
                    type: 'blog-rules',
                    title: 'Reglas de la Comunidad Ágora',
                    content: getDefaultRulesContent(),
                    updatedAt: new Date().toISOString()
                });
            } finally {
                setLoading(false);
            }
        };

        loadBlogRules();
    }, []);

    const getDefaultRulesContent = (): string => {
        return `
      <div class="rules-content">
        <h3>Normas de Convivencia</h3>
        <ul class="rules-list">
          <li>
            <strong>Respeto y tolerancia:</strong> Mantén siempre un trato respetuoso hacia todos los miembros de la comunidad. No se tolerarán insultos, amenazas o cualquier forma de acoso.
          </li>
          <li>
            <strong>Prohibición de lenguaje soez:</strong> Está prohibido el uso de lenguaje vulgar, obsceno o inapropiado en cualquier contexto dentro de la plataforma.
          </li>
          <li>
            <strong>Cero tolerancia al racismo:</strong> No se permitirán comentarios, publicaciones o cualquier tipo de contenido que promueva discriminación racial o étnica.
          </li>
          <li>
            <strong>Prohibición de xenofobia:</strong> Está estrictamente prohibido cualquier contenido que manifieste rechazo, hostilidad o discriminación hacia personas de otros países o culturas.
          </li>
          <li>
            <strong>No discriminación:</strong> Prohibido cualquier tipo de discriminación por motivos de género, orientación sexual, religión, discapacidad o cualquier otra característica personal.
          </li>
          <li>
            <strong>Contenido apropiado:</strong> Todo el contenido compartido debe ser apropiado para todos los públicos y relacionado con los temas de la comunidad.
          </li>
          <li>
            <strong>No spam:</strong> Está prohibido el envío repetitivo de mensajes o contenido no deseado.
          </li>
          <li>
            <strong>Veracidad de la información:</strong> Comparte información veraz y evita la difusión de noticias falsas o información engañosa.
          </li>
          <li>
            <strong>Privacidad:</strong> Respeta la privacidad de otros usuarios. No compartas información personal de terceros sin su consentimiento.
          </li>
          <li>
            <strong>Uso responsable:</strong> Utiliza la plataforma de manera responsable y constructiva, contribuyendo positivamente a la comunidad.
          </li>
        </ul>

        <h3>Protección de Datos Personales</h3>
        <div class="gdpr-section">
          <p>
            <strong>Cumplimiento del RGPD:</strong> En conformidad con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea, 
            te informamos que tienes derecho a:
          </p>
          <ul>
            <li>Acceder a tus datos personales</li>
            <li>Rectificar información incorrecta</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Limitar el tratamiento de tus datos</li>
            <li>Portabilidad de tus datos</li>
            <li>Oponerte al tratamiento de tus datos</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, puedes contactarnos a través de nuestros canales oficiales. 
            Nos comprometemos a responder a tu solicitud en un plazo máximo de 30 días.
          </p>
        </div>

        <h3>Consecuencias por Incumplimiento</h3>
        <div class="consequences-section">
          <p>El incumplimiento de estas reglas puede resultar en:</p>
          <ul>
            <li>Advertencia oficial</li>
            <li>Suspensión temporal de la cuenta</li>
            <li>Eliminación permanente de la cuenta</li>
            <li>Restricción de funcionalidades</li>
          </ul>
        </div>

        <div class="footer">
          <p>
            <strong>Nota importante:</strong> Estas reglas pueden ser actualizadas periódicamente. 
            Te notificaremos sobre cualquier cambio significativo. El uso continuado de la plataforma 
            implica la aceptación de las reglas vigentes.
          </p>
          <p>
            Al registrarte en Ágora, aceptas cumplir con todas estas normas y contribuir a mantener 
            un ambiente sano y constructivo para toda la comunidad.
          </p>
        </div>
      </div>
    `;
    };

    if (loading) {
        return (
            <div className={styles.rulesContainer}>
                <div className={styles.loading}>
                    <p>Cargando reglas de la comunidad...</p>
                </div>
            </div>
        );
    }

    if (error && !blogRules) {
        return (
            <div className={styles.rulesContainer}>
                <div className={styles.error}>
                    <p>Error al cargar las reglas de la comunidad. Por favor, inténtalo más tarde.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.rulesContainer}>
            {error && (
                <div className={styles.warning}>
                    <p>⚠️ {error}</p>
                </div>
            )}
            {blogRules && (
                <LegalTextGeneric
                    type="blog-rules"
                    mainTitle={blogRules.title}
                    text={blogRules.content}
                    updatedAt={blogRules.updatedAt ?? ""}
                />
            )}
        </div>
    );
};

export default BlogRules;
