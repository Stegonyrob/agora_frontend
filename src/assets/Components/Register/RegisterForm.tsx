import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import UserService from '../../../core/user/UserService';
import { sanitizeInput, validateInput } from '../../../utils/validationUtils';
import styles from './RegisterForm.module.scss';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

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
      return;
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    // Ajusta el DTO según tu backend
    const userData = {
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: sanitizedPassword,
    };

    try {
      const userService = new UserService();
      await userService.registerUser(userData);
      // Reset form after successful registration
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>Formulario de Registro</Card.Title>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Nombre de Usuario</Form.Label>
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
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <div className={styles.buttonContainer}>
            <Button variant="danger" type="button" className={styles.button}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className={styles.button}>
              Enviar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default RegisterForm;