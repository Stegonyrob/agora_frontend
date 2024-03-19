import { FormEvent, useState } from 'react';

interface FormState {
 name: string;
 email: string;
 message: string;
}

const ContactForm: React.FC = () => {
 const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
 });

 const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
 };

 const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Aquí es donde se produce el efecto secundario: enviamos la información del formulario
    await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    });

    // Limpiamos el formulario después de enviar la información
    setFormState({ name: '', email: '', message: '' });
 };

 return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formState.name} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formState.email} onChange={handleChange} />
      </label>
      <label>
        Message:
        <textarea name="message" value={formState.message} onChange={handleChange} />
      </label>
      <button type="submit">Send</button>
    </form>
 );
};

export default ContactForm;