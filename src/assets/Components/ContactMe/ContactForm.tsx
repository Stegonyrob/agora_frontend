import contactService from "@/core/contact/contactService";
import React, { FormEvent, useState } from "react";
import styles from './ContactForm.module.scss';
const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await contactService.sendContactForm(formState);
      setStatus("Mensaje enviado exitosamente.");
      setFormState({ name: "", email: "", message: "" }); // Limpiar el formulario
    } catch (error) {
      setStatus("Error al enviar el mensaje. Inténtalo nuevamente.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Nombre*:
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
        />
      </label>


      <label>
        Correo Electrónico*:
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Mensaje*:
        <textarea
          name="message"
          value={formState.message}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Enviar</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default ContactForm;