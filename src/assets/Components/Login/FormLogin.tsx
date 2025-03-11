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

  // Función para validar los inputs del formulario
  const validateInput = (input: string) => {
    // Expresión regular que permite solo caracteres alfanuméricos, guiones bajos, puntos y arrobas
    const regex = /^[a-zA-Z0-9_@.-]*$/;
    // Retorna true si el input coincide con la expresión regular, de lo contrario false
    return regex.test(input);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validar los inputs antes de enviarlos al servidor
    if (!validateInput(username) || !validateInput(password)) {
      // Si los inputs no son válidos, mostrar una alerta y detener el proceso
      alert('Invalid input detected.');
      return;
    }
    try {
      const loginService = new LoginService();
      const tokenDTO: ITokenDTO = {
        userId: 0,
        role: '',
        accessToken: '',
        refreshToken: '',
        userName: '',
      };
      const userName = username;
      // Enviar los datos al servidor solo si son válidos
      const response = await loginService.post({ username, password });
      dispatch(login(response));
      console.log(response);

      const accessToken = response.accessToken;
      console.log(response.accessToken);

      // Almacenar los tokens y otros datos en sessionStorage
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', response.refreshToken);
      sessionStorage.setItem('userId', String(response.userId));
      sessionStorage.setItem('userName', userName);
      sessionStorage.setItem('role', accessToken);

      // Decodificar el payload del token para obtener los roles del usuario
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
      console.log(tokenPayload.roles);
      // Redirigir al usuario según su rol
      if (tokenPayload.roles === 'ROLE_ADMIN') {
        navigate('/admin', { state: { userId: String(response.userId) } });
      } else if (tokenPayload.roles === 'ROLE_USER') {
        navigate('/blog', { state: { userId: String(response.userId) } });
      } else {
        console.error('Unexpected user role:', response.role);
      }

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