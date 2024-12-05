import Avatar from '@/assets/Components/Blog/admin/header/Avatar';

import styles from '@/assets/Components/Blog/admin/button/edit/EditModalForm.module.scss';
import IProfile from '@/core/profiles/IProfile';
import IProfileDTO from '@/core/profiles/IProfileDTO';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
interface ProfileFormProps {
  profile: IProfile | null;
  onSelect: (profile: IProfile) => void;
  onSubmit: (updatedProfile: IProfileDTO) => void;
  onClose: () => void;
  show: boolean;
  userId: number;
}




const ProfileForm = ({ userId, profile, onSubmit, onClose, show }: ProfileFormProps) => {
  const [profileDTOState, setProfileDTOState] = useState<IProfileDTO>({} as IProfileDTO);
  const [firstName, setFirstName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [relationship, setRelationship] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  console.log(userId);
  console.log(firstName)
  console.log('ProfileForm profileDTOState:', profileDTOState);
  console.log('ProfileForm profile:', profile);



  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newProfile: IProfileDTO = {
      id: profile?.id || 0,
      firstName: profileDTOState.firstName || '',
      lastName1: profileDTOState.lastName1 || '',
      lastName2: profileDTOState.lastName2 || '',
      relationship: profileDTOState.relationship || '',
      email: profileDTOState.email || '',
      avatar: profileDTOState.avatar || '',
      city: profileDTOState.city || '',
      country: profileDTOState.country || '',
      phone: profileDTOState.phone || '',
      password: profileDTOState.password || '',
      confirmPassword: profileDTOState.confirmPassword || '',
    };

    if (newProfile.password !== newProfile.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      onSubmit(newProfile);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div >
      <Modal show={show} onHide={onClose} className={styles.modalCard}>
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title >Formulario de Edición de Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <label>
              Nombre:
              <input type="text" value={profileDTOState.firstName || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, firstName: e.target.value })} />
            </label>
            <br />
            <label>
              Apellido 1:
              <input type="text" value={profileDTOState.lastName1 || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, lastName1: e.target.value })} />
            </label>
            <br />
            <label>
              Apellido 2:
              <input type="text" value={profileDTOState.lastName2 || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, lastName2: e.target.value })} />
            </label>
            <br />
            <label>
              Parentesco:
              <input type="text" value={profileDTOState.relationship || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, relationship: e.target.value })} />
            </label>
            <br />
            <label>
              Email:
              <input type="text" value={profileDTOState.email || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, email: e.target.value })} />
            </label>
            <br />
            <label>
              Imagen de perfil:
              <Avatar source_avatar={profileDTOState.avatar || ''} url_avatar={profileDTOState.avatar || ''} alt_avatar={profileDTOState.avatar || ''} userId={userId} userName={profileDTOState.firstName || ''} source={''} />
              <input type="text" value={profileDTOState.avatar || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, avatar: e.target.value })} />
            </label>
            <br />
            <label>
              Ciudad:
              <input type="text" value={profileDTOState.city || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, city: e.target.value })} />
            </label>
            <br />
            <label>
              País:
              <input type="text" value={profileDTOState.country || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, country: e.target.value })} />
            </label>
            <br />
            <label>
              Teléfono:
              <input type="text" value={profileDTOState.phone || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, phone: e.target.value })} />
            </label>
            <br />
            <label>
              Contraseña:
              <input type="password" value={profileDTOState.password || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, password: e.target.value })} />
            </label>
            <br />
            <label>
              Confirmar contraseña:
              <input type="password" value={profileDTOState.confirmPassword || ''} onChange={(e) => setProfileDTOState({ ...profileDTOState, confirmPassword: e.target.value })} />
            </label>
            <br />
            <Button type="submit" variant="primary">{profile ? 'Actualizar Perfil' : 'Crear Perfil'}</Button>
          </form>
        </Modal.Body>

      </Modal>
    </div>
  );
};




export default ProfileForm;




