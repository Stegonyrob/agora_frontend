import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import api from '../../../services/api';
import styles from './RegisterForm.module.scss';

function RegisterForm() {
 
  const [firstName, setFirstName] = useState('');
  const [lastNameOne, setLastNameOne] = useState('');
  const [lastNameTwo, setLastNameTwo] = useState('');
  const [username, setUsername] = useState('');
  const [relationship, setRelationship] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userData = {
      username,
      firstName: firstName,
      lastName: `${lastNameOne} ${lastNameTwo}`,
      relationship,
      email,
      password,
      confirmPassword,
      city,
    };

    try {
      await api.registerUser(userData);
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
        <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text"  placeholder="Nombre" value={firstName}  onChange={(e) => setFirstName(e.target.value)}  required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastNameOne">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control type="text" placeholder="Primer Apellido" value={lastNameOne} onChange={(e) => setLastNameOne(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastNameTwo">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control type="text" placeholder="Segundo Apellido" value={lastNameTwo} onChange={(e) => setLastNameTwo(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNickname">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRelationship">
            <Form.Label>Parentesco</Form.Label>
            <Form.Control type="text" placeholder="Parentesco" value={relationship} onChange={(e) => setRelationship(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control type="text" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} required className={styles.input}/>
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
