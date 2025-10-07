import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginService from '../../../core/auth/LoginService';
// Ajusta el import según la ubicación real
import { login } from '@/core/auth/sessionStore';
import { AuthService } from '../../../core/auth/AuthService';
import { LoginRepository } from '../../../core/auth/LoginRepository';
import { validateInput } from '../../../utils/validationUtils';
import Logo from '../Logo/LogoSimply';
import ForgotPasswordForm from './ForgotPasswordForm';
import styles from './FormLogin.module.scss';
import SocialLogin from './SocialLogin';



interface FormLoginProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
  setRegister: Dispatch<SetStateAction<boolean>>;
  setUserId: Dispatch<SetStateAction<string>>;
  setUserName: Dispatch<SetStateAction<string>>;
  setRole: Dispatch<SetStateAction<string>>;
}


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

const FormLogin: React.FC<FormLoginProps> = ({ setLogin, setRegister, setUserId, setUserName, setRole }) => {
  const [useremail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authService = new AuthService();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    console.log('[LOGIN] Enviando login:', { useremail, password });

    if (!validateInput(useremail) || !validateInput(password)) {
      setErrorMessage('Por favor, ingrese un email y contraseña válidos.');
      setIsLoading(false);
      return;
    }

    try {
      const loginService = new LoginService();
      const loginPayload = { username: useremail, password };
      console.log('[LOGIN] Payload enviado al backend:', loginPayload);
      const response = await loginService.login(loginPayload);
      console.log('[LOGIN] Respuesta backend:', response);
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
        console.error('[LOGIN] Rol inesperado:', role, jwtData);
      }
    } catch (error: any) {
      setErrorMessage('Error al iniciar sesión. Verifica tus credenciales.');
      console.error('[LOGIN] Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (token: string) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await authService.loginWithGoogle(token);

      // Store additional session data
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userId', String(response.userId));
      sessionStorage.setItem('userEmail', response.user.email);
      sessionStorage.setItem('role', 'ROLE_USER'); // Assuming social login users get standard role

      dispatch(login({
        userId: response.userId,
        role: 'ROLE_USER',
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userName: response.user.username,
        useremail: response.user.email,
        isLoggedIn: true,
      }));

      navigate('/blog', { state: { userId: String(response.userId) } });
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrorMessage('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Facebook login handler - COMMENTED OUT FOR PRODUCTION
  // const handleFacebookLogin = async (token: string) => {
  //   try {
  //     setIsLoading(true);
  //     setErrorMessage('');

  //     const response = await authService.loginWithFacebook(token);

  //     // Store additional session data
  //     sessionStorage.setItem('isLoggedIn', 'true');
  //     sessionStorage.setItem('userId', String(response.userId));
  //     sessionStorage.setItem('userEmail', response.user.email);
  //     sessionStorage.setItem('role', 'ROLE_USER'); // Assuming social login users get standard role

  //     dispatch(login({
  //       userId: response.userId,
  //       role: 'ROLE_USER',
  //       accessToken: response.accessToken,
  //       refreshToken: response.refreshToken,
  //       userName: response.user.username,
  //       useremail: response.user.email,
  //       isLoggedIn: true,
  //     }));

  //     navigate('/blog', { state: { userId: String(response.userId) } });
  //   } catch (error: any) {
  //     console.error('Facebook login error:', error);
  //     setErrorMessage('Error al iniciar sesión con Facebook. Inténtalo de nuevo.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const togglePass = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotRequest = async (email: string) => {
    // Detectar si es admin por el email si lo necesitas
    await LoginRepository.requestPasswordRecovery(email);
  };

  if (showForgot) {
    return (
      <Card className={styles.card}>
        <Card.Body>
          <ForgotPasswordForm
            onBackToLogin={() => setShowForgot(false)}
            onRequest={handleForgotRequest}
          />
        </Card.Body>
      </Card>
    );
  }

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
              pattern="^([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9._\-]{3,})$"
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
          <Button
            className={styles.loginButton}
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </Form>

        <div className={styles.registerLink}>
          <button
            type="button"
            className="btn btn-link"
            style={{ padding: 0, color: '#0d6efd', background: 'none', border: 'none' }}
            onClick={() => setShowForgot(true)}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* SOCIAL LOGIN COMPONENT - GOOGLE ONLY FOR PRODUCTION */}
        <SocialLogin
          onGoogleLogin={handleGoogleLogin}
          isLoading={isLoading}
        />

        <div className={styles.registerLink}>
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FormLogin;