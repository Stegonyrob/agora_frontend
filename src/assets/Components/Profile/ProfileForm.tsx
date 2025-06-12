import Challenge from "@/assets/Components/Challenge/Challenge"; // Asegúrate de importar el componente
import IProfile from '@/core/profiles/IProfile';
import IProfileDTO from '@/core/profiles/IProfileDTO';
import { sanitizeInput, validateInput } from '@/utils/validationUtils';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Avatar from './Avatar';
import styles from './ProfileForm.module.scss';

interface ProfileFormProps {
  profile: IProfileDTO;
  onSelect?: (profile: IProfile) => void;
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
  const [challengeOk, setChallengeOk] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);

    if (!challengeOk) {
      setErrorMessage("Por favor, resuelve el desafío correctamente.");
      return;
    }

    // Sanitize inputs
    const sanitizedFirstName = sanitizeInput(formState.firstName);
    const sanitizedLastName1 = sanitizeInput(formState.lastName1);
    const sanitizedLastName2 = sanitizeInput(formState.lastName2);
    const sanitizedRelationship = sanitizeInput(formState.relationship);
    const sanitizedEmail = sanitizeInput(formState.email);
    const sanitizedCity = sanitizeInput(formState.city);
    const sanitizedCountry = sanitizeInput(formState.country);
    const sanitizedPhone = sanitizeInput(formState.phone);

    // Validar los inputs antes de enviarlos al servidor
    if (!validateInput(sanitizedFirstName) || !validateInput(sanitizedLastName1) || !validateInput(sanitizedEmail)) {
      setErrorMessage('Se detectaron entradas no válidas.');
      return;
    }

    const updatedProfile: IProfileDTO = {
      ...formState,
      firstName: sanitizedFirstName,
      lastName1: sanitizedLastName1,
      lastName2: sanitizedLastName2,
      relationship: sanitizedRelationship,
      email: sanitizedEmail,
      city: sanitizedCity,
      country: sanitizedCountry,
      phone: sanitizedPhone,
    };

    try {
      await onSubmit(updatedProfile);
      onClose();
    } catch (error) {
      setErrorMessage('Error al enviar el formulario.');
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
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
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

          <Challenge onVerify={setChallengeOk} />

          <Button type="submit" variant="primary" disabled={!challengeOk}>
            {profile ? 'Actualizar Perfil' : 'Crear Perfil'}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileForm;