import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginService from '../../../core/auth/LoginService';
// Ajusta el import según la ubicación real
import { login } from '@/core/auth/sessionStore';
import { validateInput } from '../../../utils/validationUtils';
import Logo from '../Logo/LogoSimply';
import styles from './FormLogin.module.scss';

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
  const [useremail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!validateInput(useremail) || !validateInput(password)) {
      setErrorMessage('Por favor, ingrese un email y contraseña válidos.');
      return;
    }

    try {
      const loginService = new LoginService();
      const response = await loginService.login({ useremail, password });
      const jwtData = parseJwt(response.accessToken);
      if (jwtData.exp) {
        sessionStorage.setItem('sessionExpiresAt', jwtData.exp * 1000 + '');
      }
      const role = typeof jwtData.roles === "string" ? jwtData.roles : "";
      const userName = typeof jwtData.username === "string" ? jwtData.username : "";

      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('token', response.accessToken);
      sessionStorage.setItem('accessToken', response.accessToken);
      sessionStorage.setItem('refreshToken', response.refreshToken);
      sessionStorage.setItem('userId', String(response.userId));
      sessionStorage.setItem('userEmail', useremail);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem("viewAsUser", "false");

      if (role === "ROLE_ADMIN") {
        sessionStorage.setItem("isAdmin", "true");
      } else {
        sessionStorage.removeItem("isAdmin");
      }
      dispatch(login({
        userId: response.userId,
        role,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userName,
        useremail,
        isLoggedIn: true,
      }));

      if (role === 'ROLE_ADMIN') {
        navigate('/admin', { state: { userId: String(response.userId) } });
      } else if (role === 'ROLE_USER') {
        navigate('/blog', { state: { userId: String(response.userId) } });
      } else {
        setErrorMessage('Rol de usuario inesperado.');
      }
    } catch (error: any) {
      setErrorMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const togglePass = () => {
    setShowPassword(!showPassword);
  };


  return (
    <Card className={styles.card}>
      <Card.Header className={styles.cardHeader}>
        <Logo className={styles.logoMedium} />
        <Card.Title className={styles.cardTitle}>Inicio de Sesión</Card.Title>
      </Card.Header>

      <Card.Body>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formLoginEmail">
            <Form.Label className={styles.label}>Email o Nombre de Usuario</Form.Label>
            <Form.Control
              className={styles.input}
              type="text"
              placeholder="ejemplo@gmail.com o nombre de usuario"
              value={useremail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              name="useremail"
              autoComplete="username"
              autoFocus
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9._-]{3,}$"
              title="Debe ser un email válido o un nombre de usuario con al menos 3 caracteres."
            />
          </Form.Group>
          <Form.Group controlId="formLoginPassword">
            <Form.Label className={styles.label}>Contraseña</Form.Label>
            <div className={styles.passwordWrapper}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Contraseña"
                className={styles.passwordInput}
              />
              <i
                className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'} ${styles.showPasswordIcon}`}
                onClick={togglePass}
              />
            </div>
          </Form.Group>
          <Button className={styles.loginButton} variant="primary" type="submit">
            Iniciar Sesión
          </Button>
        </Form>
        <div className={styles.registerLink}>
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FormLogin;