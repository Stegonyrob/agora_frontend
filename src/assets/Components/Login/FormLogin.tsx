import axios from 'axios';
import { useState } from 'react';
import { Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/userSlice';
import Logo from '../Logo/LogoSimply';

const FormLogin = () => {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const response = await axios.get('http://localhost:8080/api/v1/login', {
        auth: {
          username: username,
          password: password,
        },
      });
      console.log(response.data); // Esto debería imprimir el objeto response.data


      // Acceder a userId y username correctamente
      const userId = response.data.userId;
      const role = response.data.role; 
      const userName = response.data.username;
      dispatch(loginUser({ userId, role }));
      console.log(userId, username); // Debería imprimir "1" y "admin"

      navigate('/foroview', { state: { userId } }); 

    } catch (error) {
      console.error('Error:', error);
    }
 };

 return (
    <form onSubmit={handleSubmit}>
      <Card className="text-center">
        <Card.Body>
          <Logo />
          <Card.Title>Inicio de Sesión</Card.Title>
          <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
            <Form.Control type="text" name="email" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Email" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-3">
            <Form.Control type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Contraseña" />
          </FloatingLabel>
          <Button variant="primary" type="submit">Enviar</Button>
        </Card.Body>
        <Card.Footer className="text-center">
          No tienes cuenta <a href="/register">Regístrate Aquí</a>
        </Card.Footer>
      </Card>
    </form>
 );
};

export default FormLogin;
