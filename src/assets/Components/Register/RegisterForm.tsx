import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../../core/auth/AuthService';
import { RegisterService } from '../../../core/register/RegisterService';
import { useRulesAcceptance } from '../../../hooks/useRulesAcceptance';
import { sanitizeInput, validateInput } from '../../../utils/validationUtils';
import RulesModal from '../Legal/RulesModal';
import styles from './RegisterForm.module.scss';

function RegisterForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    showRulesModal,
    rulesAccepted,
    canProceed: canProceedToRegister,
    showModal: showRulesModalHandler,
    hideModal: handleRulesModalClose,
    toggleAcceptance: handleRulesAcceptChange
  } = useRulesAcceptance(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // Check if rules were accepted
    if (!canProceedToRegister) {
      setErrorMessage('Debes aceptar las reglas de la comunidad para poder registrarte.');
      showRulesModalHandler();
      setIsLoading(false);
      return;
    }

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

    if (
      !validateInput(sanitizedUsername) ||
      !validateInput(sanitizedEmail) ||
      !validateInput(sanitizedPassword) ||
      !validateInput(sanitizedConfirmPassword)
    ) {
      setErrorMessage('Se detectaron entradas no válidas.');
      setIsLoading(false);
      return;
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    // Ajusta el DTO según tu backend - incluye la aceptación de reglas
    const userData = {
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: sanitizedPassword,
      rulesAccepted: rulesAccepted // Incluir explícitamente la aceptación de reglas
    };

    try {
      // 1. Registrar usuario usando RegisterService
      const registerService = new RegisterService();
      await registerService.register(userData);

      // 2. Login automático después del registro exitoso
      const authService = new AuthService();
      await authService.login({
        email: sanitizedEmail,
        password: sanitizedPassword
      });

      // 3. Reset form after successful registration and login
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // 4. Redirigir al usuario a la página principal o dashboard
      navigate('/blog'); // Cambia esto por la ruta que prefieras

    } catch (error: any) {
      console.error('Error en registro/login:', error);

      // Si el registro fue exitoso pero el login falló
      if (error.message?.includes('login') || error.response?.status === 401) {
        setErrorMessage('Registro exitoso. Por favor, inicia sesión manualmente.');
        // Opcional: redirigir al login después de un delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(error.message || 'Error al registrar el usuario.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRegistration = () => {
    handleRulesModalClose();
    // You might want to redirect to home page or login page here
    window.history.back();
  };

  return (
    <>
      <RulesModal
        show={showRulesModal}
        onHide={handleRulesModalClose}
        onAccept={handleRulesAcceptChange}
        isAccepted={rulesAccepted}
      />

      <Card className={styles.card}>
        <Card.Body>
          <Card.Title className={styles.title}>Formulario de Registro</Card.Title>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label className={styles.label}>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className={styles.label}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </Form.Group>
            <div className={styles.formRow} >
              <Form.Group className="mb-3" controlId="formPassword" style={{ flex: 1 }}>
                <Form.Label className={styles.label}>Contraseña</Form.Label>
                <div className={styles.passwordInputWrapper}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Contraseña"
                    className={styles.passwordInput}
                  />
                  <i
                    className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'} ${styles.showPasswordIcon}`}
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formConfirmPassword" style={{ flex: 1 }}>
                <Form.Label className={styles.label}>Confirmar Contraseña</Form.Label>
                <div className={styles.passwordInputWrapper}>
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirmar Contraseña"
                    className={styles.passwordInput}
                  />
                  <i
                    className={`bi ${showConfirmPassword ? 'bi-eye' : 'bi-eye-slash'} ${styles.showPasswordIcon}`}
                    onClick={() => setShowConfirmPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  />
                </div>
              </Form.Group>
            </div>

            {!canProceedToRegister && (
              <div className={styles.rulesNotice}>
                <p>⚠️ Debes aceptar las reglas de la comunidad para continuar</p>
                <Button
                  variant="outline-primary"
                  onClick={showRulesModalHandler}
                  className={styles.showRulesButton}
                >
                  Ver Reglas de la Comunidad
                </Button>
              </div>
            )}

            <div className={styles.buttonContainer}>
              <Button variant="danger" type="button" className={styles.button}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                className={styles.button}
                disabled={!canProceedToRegister || isLoading}
              >
                {isLoading ? 'Registrando...' : 'Enviar'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default RegisterForm;