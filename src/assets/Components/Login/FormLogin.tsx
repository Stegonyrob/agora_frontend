
import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ITokenDTO } from '../../../core/auth/ITokenDTO';
import LoginService from '../../../core/auth/LoginService';
import { login } from '../../../redux/reducers/loginSlice';
import Logo from '../Logo/LogoSimply';
import styles from './FormLogin.module.scss';

interface FormLoginProps {
  setLogin: (value: boolean) => void;
  setRegister: (value: boolean) => void;
  setUserId: (value: string) => void;
  setUserName: (value: string) => void;
  setRole: (value: string) => void;
}

const FormLogin: React.FC<FormLoginProps> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const loginService = new LoginService();
      const tokenDTO: ITokenDTO = {
        userId: 0,
        role: '',
        accessToken: '',
        refreshToken: '',
        userName: '',
      };
      const userName = username
      const response = await loginService.post({ username, password });
      dispatch(login(response));
      navigate('/blog', { state: { userId: String(response.userId) } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className={styles.card}>
        <Card.Body className='card-login'>
          <Logo className={styles.logoMedium} />
          <Card.Title>Inicio de Sesión</Card.Title>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="NeoThe Matrix"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña"
              className={styles.input}
            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button
              variant="light"
              size="lg"
              type="submit"
              className={`${styles.button} text-bg-info`}
            >
              Enviar
            </Button>
          </div>
        </Card.Body>
        <Card.Footer className="text-center">
          No tienes cuenta <a href="/register">Regístrate Aquí</a>
        </Card.Footer>
      </Card>
    </form>
  );
};

export default FormLogin;