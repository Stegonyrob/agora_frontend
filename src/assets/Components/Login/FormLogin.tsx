import axios from 'axios';
import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/userSlice';
import Logo from '../Logo/LogoSimply';
import styles from './FormLogin.module.scss';

const FormLogin = () => {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const handleSubmit = async (event: { preventDefault: () => void; }) => {
  event.preventDefault();
 
  try {
    const response = await axios.post('http://localhost:8080/auth/login', {
      username: username,
      password: password,
    });
    
    // Almacenar el token JWT
    localStorage.setItem('authToken', response.data.token);
 
    // Obtener la información del usuario
    const userId = response.data.userId;
    const role = response.data.role; 
    const userName = response.data.username;
    
    // Despachar la acción de Redux para actualizar el estado del usuario
    dispatch(loginUser({ userId, role}));
 
    // Redirigir al usuario a la página de blog
    navigate('/blogview', { state: { userId } }); 
  } catch (error) {
    console.error('Error:', error);
  }
}

 return (
    <form onSubmit={handleSubmit} >
   <Card className={styles.card}>
        <Card.Body className='card-login'>
          <Logo />
          <Card.Title>Inicio de Sesión</Card.Title>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" placeholder="name@example.com" value={username} onChange={(e) => setUsername(e.target.value)} required   className={styles.input}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Contraseña" className={styles.input}/>
      </Form.Group>
      <div className="d-grid gap-2">
      <Button
      variant="light"
      size="lg"
      type="submit"
      className={`${styles.button} text-bg-info`}
    >
      Enviar
    </Button>
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
