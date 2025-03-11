import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { registerUser } from '../../../services/users.api';
import { validateInput } from '../../../utils/validationUtils';
import styles from './RegisterForm.module.scss';

function RegisterForm() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validar los inputs antes de enviarlos al servidor
    if (!validateInput(username) || !validateInput(email) || !validateInput(password) || !validateInput(confirmPassword)) {
      // Si los inputs no son válidos, mostrar una alerta y detener el proceso
      alert('Invalid input detected.');
      return;
    }

    const userData = {
      username,
      email,
      password,
      confirmPassword,

    };

    try {
      console.log({ username, email, password, confirmPassword });
      await registerUser(userData);
      console.log(userData)
      console.log("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>Formulario de Registro</Card.Title>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className={styles.input} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={styles.input} />
          </Form.Group>

          <Button
            variant="danger"
            type="submit"
            className={styles.button}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className={styles.button}
          >
            Enviar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default RegisterForm;
