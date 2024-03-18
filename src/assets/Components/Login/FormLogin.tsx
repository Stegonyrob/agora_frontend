import axios from 'axios';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice';

const LoginForm: React.FC = () => {
 const [email, setEmail] = useState<string>('');
 const [password, setPassword] = useState<string>('');
 const dispatch = useDispatch();

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      dispatch(login(response.data.user));
      // Navegación o cualquier otra lógica después del inicio de sesión
    } catch (error) {
      console.error('Error logging in', error);
    }
 };

 return (
    <form onSubmit={handleSubmit}>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Inicio de Sesión</Card.Title>
          <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </FloatingLabel>
          <Button variant="primary" type="submit">Enviar</Button>
        </Card.Body>
        <Card.Footer className="text-center">No tienes cuenta <a href="/register">Registrate Aquí</a></Card.Footer>
      </Card>
    </form>
 );
};

export default LoginForm;