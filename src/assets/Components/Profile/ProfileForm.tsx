import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import api from '../../../services/api';
import AvatarComponent from '../Blog/CardUser/AvatarComponent';
import styles from './RegisterForm.module.scss';

function RegisterForm() {

  const [firstName, setFirstName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [relationship, setRelationship] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('')
  const [city, setCity] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userData = {
      avatar,
      firstName: firstName,
      lastName1: `${lastName1} `,
      lastName2: `${lastName2}`,
      relationship,
      email,
      city,
    };

    try {
      await api.registerUser(userData);
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
          <AvatarComponent />
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastName1">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control type="text" placeholder="Primer Apellido" value={lastName1} onChange={(e) => setLastName1(e.target.value)} required className={styles.input} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastName2">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control type="text" placeholder="Segundo Apellido" value={lastName2} onChange={(e) => setLastName2(e.target.value)} required className={styles.input} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRelationship">
            <Form.Label>Parentesco</Form.Label>
            <Form.Control type="text" placeholder="Parentesco" value={relationship} onChange={(e) => setRelationship(e.target.value)} required className={styles.input} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control type="text" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} required className={styles.input} />
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
