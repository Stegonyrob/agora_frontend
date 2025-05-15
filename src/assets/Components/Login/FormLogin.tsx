import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginService from '../../../core/auth/LoginService';
import { login } from '../../../redux/reducers/loginSlice';
import { validateInput } from '../../../utils/validationUtils';
import Logo from '../Logo/LogoSimply';
import styles from './FormLogin.module.scss';

// Utilidad para decodificar el JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

const FormLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submission started.');

    if (!validateInput(username) || !validateInput(password)) {
      console.log('Invalid input detected.');
      alert('Invalid input detected.');
      return;
    }

    try {
      console.log('Attempting login with username:', username);
      const loginService = new LoginService();
      const response = await loginService.post({ username, password });

      console.log('Login successful, processing response.');
      const jwtData = parseJwt(response.accessToken);
      const role = typeof jwtData.roles === "string" ? jwtData.roles : "";
      const userName = typeof jwtData.username === "string" ? jwtData.username : "";

      console.log('Storing session data.');
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('accessToken', response.accessToken);
      sessionStorage.setItem('refreshToken', response.refreshToken);
      sessionStorage.setItem('userId', String(response.userId));
      sessionStorage.setItem('userName', userName);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem("viewAsUser", "false");
      console.log('Session data:', {
        isLoggedIn: sessionStorage.getItem('isLoggedIn'),
        accessToken: sessionStorage.getItem('accessToken'),
        refreshToken: sessionStorage.getItem('refreshToken'),
        userId: sessionStorage.getItem('userId'),
        userName: sessionStorage.getItem('userName'),
        role: sessionStorage.getItem('role'),
        viewAsUser: sessionStorage.getItem("viewAsUser"),
      });
      console.log("sessionStorage", sessionStorage);
      console.log('Session data stored successfully.');
      console.log(sessionStorage.getItem('viewAsUser'));

      console.log('Dispatching login to Redux.');

      dispatch(login({
        userId: response.userId,
        role,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userName,
      }));

      console.log('Navigating based on role.');
      if (role === 'ROLE_ADMIN') {
        console.log('Redirecting to admin dashboard.');
        navigate('/admin', { state: { userId: String(response.userId) } });
      } else if (role === 'ROLE_USER') {
        console.log('Redirecting to blog.');
        navigate('/blog', { state: { userId: String(response.userId) } });
      } else {
        console.error('Unexpected user role:', role);
      }
    } catch (error) {
      console.error('Error during login process:', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
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