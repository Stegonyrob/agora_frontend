import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import styles from './RegisterForm.module.scss';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [relationship, setRelationship] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica de envío de los datos del formulario
    // Por ejemplo, llamar a una función que envíe los datos a un servidor
    console.log({
      username,
      firstName,
      lastName,
      nickname,
      relationship,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>Formulario de Registro</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text"  placeholder="Nombre" value={username}  onChange={(e) => setUsername(e.target.value)}  required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control type="text" placeholder="Primer Apellido" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control type="text" placeholder="Segundo Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} required className={styles.input}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNickname">
            <Form.Label>NickName</Form.Label>
            <Form.Control type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required className={styles.input}/>
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
