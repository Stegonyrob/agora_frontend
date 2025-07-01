export const LEGAL_TEXT_TYPES = {
  terms: "Términos y Condiciones",
  privacy: "Política de Privacidad",
  cookies: "Política de Cookies",
  "blog-rules": "Reglas del Blog",
} as const;

export type LegalTextType = keyof typeof LEGAL_TEXT_TYPES;

export const getLegalTextTemplate = (type: LegalTextType) => {
  const title = `${LEGAL_TEXT_TYPES[type]} - Ágora Centro Educativo`;

  const templates = {
    terms: `<h2>Términos y Condiciones de Uso</h2>
<p>Bienvenido a Ágora Centro Educativo de Apoyo Especializado. Al utilizar nuestros servicios, usted acepta cumplir con estos términos.</p>
<h3>1. Uso del Servicio</h3>
<p>Nuestros servicios están destinados a proporcionar apoyo educativo especializado.</p>
<h3>2. Responsabilidades del Usuario</h3>
<p>Los usuarios se comprometen a utilizar el servicio de manera responsable.</p>
<h3>3. Contacto</h3>
<p>Para cualquier consulta: centroeducativoagora@gmail.com</p>`,

    privacy: `<h2>Política de Privacidad</h2>
<p>En Ágora Centro Educativo respetamos su privacidad y nos comprometemos a proteger sus datos personales.</p>
<h3>1. Información que Recopilamos</h3>
<p>Recopilamos información necesaria para brindar nuestros servicios educativos.</p>
<h3>2. Uso de la Información</h3>
<p>Utilizamos su información únicamente para los fines educativos acordados.</p>
<h3>3. Protección de Datos</h3>
<p>Implementamos medidas de seguridad para proteger su información.</p>
<h3>4. Contacto</h3>
<p>Para consultas sobre privacidad: centroeducativoagora@gmail.com</p>`,

    cookies: `<h2>Política de Cookies</h2>
<p>Este sitio web utiliza cookies para mejorar su experiencia de navegación.</p>
<h3>1. ¿Qué son las cookies?</h3>
<p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo.</p>
<h3>2. Cookies que Utilizamos</h3>
<p>Utilizamos cookies esenciales para el funcionamiento del sitio y cookies analíticas para mejorar nuestros servicios.</p>
<h3>3. Control de Cookies</h3>
<p>Puede controlar y eliminar cookies a través de la configuración de su navegador.</p>
<h3>4. Contacto</h3>
<p>Para consultas: centroeducativoagora@gmail.com</p>`,

    "blog-rules": `<h2>Reglas de la Comunidad Ágora</h2>
<p>Bienvenido a la comunidad de Ágora Centro Educativo. Para mantener un ambiente respetuoso y constructivo, te pedimos que sigas estas reglas:</p>
<h3>1. Respeto y Cortesía</h3>
<p>Trata a todos los miembros con respeto. No se tolerarán insultos, discriminación o comportamiento ofensivo.</p>
<h3>2. Contenido Apropiado</h3>
<p>Comparte contenido relacionado con educación y apoyo. Evita spam, contenido inapropiado o comercial no autorizado.</p>
<h3>3. Privacidad</h3>
<p>Respeta la privacidad de otros. No compartas información personal sin consentimiento.</p>
<h3>4. Moderación</h3>
<p>Los moderadores pueden editar o eliminar contenido que no cumpla estas reglas.</p>
<h3>5. Contacto</h3>
<p>Para consultas sobre las reglas: centroeducativoagora@gmail.com</p>`,
  };

  return {
    title,
    content: templates[type] || "<p>Contenido por defecto</p>",
  };
};
