import axios from 'axios';
import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/userSlice';
import Logo from '../Logo/LogoSimply';
import './FormLogin.scss';
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
    <form onSubmit={handleSubmit} >
      <Card className="text-center  " id='card-login'>
        <Card.Body className='card-login'>
          <Logo />
          <Card.Title>Inicio de Sesión</Card.Title>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" placeholder="name@example.com" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Contraseña" />
      </Form.Group>
      <div className="d-grid gap-2">
      <Button variant="light" size="lg"type="submit" className='ms-5 text-bg-info'>Enviar</Button>
        </div>
        </Card.Body>
        <Card.Footer className="text-center">
          No tienes cuenta <a href="/register">Regístrate Aquí</a>
        </Card.Footer>
      </Card>
    </form>
 );
};

export default FormLogin;
