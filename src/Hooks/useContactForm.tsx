import { useState } from 'react';

interface FormState {
 name: string;
 email: string;
 message: string;
}

const useContactForm = () => {
 const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
 });

 const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
 };

 const handleSubmit = async (event: React.FormEvent) => {
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

 return { formState, handleChange, handleSubmit };
};

export default useContactForm;