import { useState } from 'react';
import FormLogin from '../Components/Login/FormLogin';
import styles from './scss/Views.module.scss';
export default function LoginView() {
  const [login, setLogin] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [role, setRole] = useState<string>('');

  return (
    <div className={styles.container}>
      <FormLogin
        setLogin={setLogin}
        setRegister={setRegister}
        setUserId={setUserId}
        setUserName={setUserName}
        setRole={setRole}
      />
    </div>
  );
}

