import styles from '@/assets/Components/Blog/admin/button/edit/EditModalForm.module.scss';
import Avatar from '@/assets/Components/Blog/admin/header/Avatar';
import IProfile from '@/core/profiles/IProfile';
import IProfileDTO from '@/core/profiles/IProfileDTO';
import { validateInput } from '@/utils/validationUtils';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from "react-bootstrap/Button";

interface ProfileFormProps {
  profile: IProfileDTO;
  onSelect?: (profile: IProfile) => void; // Add this if needed
  onSubmit: (updatedProfile: IProfileDTO) => Promise<void>;
  onClose: () => void;
  show: boolean;
  userId: number;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, onClose, show }) => {
  const [formState, setFormState] = useState<IProfileDTO>({
    id: 0,
    firstName: "",
    lastName1: "",
    lastName2: "",
    relationship: "",
    email: "",
    avatar: "",
    city: "",
    country: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Sincronizar los datos del perfil con el estado del formulario
  useEffect(() => {
    if (profile) {
      setFormState(profile);
    }
  }, [profile]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validar los inputs antes de enviarlos al servidor
    if (!validateInput(formState.firstName) || !validateInput(formState.lastName1) || !validateInput(formState.email)) {
      alert('Invalid input detected.');
      return;
    }

    try {
      await onSubmit(formState);
      onClose();
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Error al enviar el formulario.');
    }
  };

  return (
    <Modal
      size="lg"
      centered
      show={show}
      onHide={onClose}
      className={styles.modalCard}
    >
      <Modal.Header className={styles.modalHeader} closeButton>
        <Modal.Title className={styles.modalTitle}>
          Formulario de Edición de Perfil
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">Nombre:</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formState.firstName || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName1">Primer Apellido:</label>
          <input
            id="lastName1"
            type="text"
            name="lastName1"
            value={formState.lastName1 || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName2">Segundo Apellido:</label>
          <input
            id="lastName2"
            type="text"
            name="lastName2"
            value={formState.lastName2 || ''}
            onChange={handleChange}
          />

          <label htmlFor="relationship">Parentesco:</label>
          <input
            id="relationship"
            type="text"
            name="relationship"
            value={formState.relationship || ''}
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formState.email || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="avatar">Imagen de perfil:</label>
          <Avatar
            source_avatar={formState.avatar || ''}
            url_avatar={formState.avatar || ''}
            alt_avatar={formState.avatar || ''}
            userId={formState.id}
            userName={formState.firstName || ''}
            source={''}
          />
          <input
            id="avatar"
            type="text"
            name="avatar"
            value={formState.avatar || ''}
            onChange={handleChange}
          />

          <label htmlFor="city">Ciudad:</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formState.city || ''}
            onChange={handleChange}
          />

          <label htmlFor="country">País:</label>
          <input
            id="country"
            type="text"
            name="country"
            value={formState.country || ''}
            onChange={handleChange}
          />

          <label htmlFor="phone">Teléfono:</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={formState.phone || ''}
            onChange={handleChange}
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formState.password || ''}
            onChange={handleChange}
          />

          <label htmlFor="confirmPassword">Confirmar contraseña:</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formState.confirmPassword || ''}
            onChange={handleChange}
          />

          <Button type="submit" variant="primary">
            {profile ? 'Actualizar Perfil' : 'Crear Perfil'}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileForm;