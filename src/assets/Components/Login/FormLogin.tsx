import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/auth';
import { loginUser } from '../../redux/userSlice';
import Logo from '../Logo/LogoSimply';
import styles from './FormLogin.module.scss';

interface FormLoginProps {
  // No props for now
}

const FormLogin: React.FC<FormLoginProps> = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log('Iniciando envío de formulario');
    event.preventDefault();
    setUserId(userId);
    try {


      console.log('Enviando credenciales a servidor');
      const { accessToken, refreshToken, userId, role } = await login(username, password);
      console.log('Servidor ha respondido con éxito');
      localStorage.setItem('authToken', accessToken);
      dispatch(loginUser({ userId: userId.toString(), role }));
      console.log('Redux ha actualizado el estado con éxito');
      navigate('/blogview', { state: { userId } });
      console.log('Navegación exitosa');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      <Card className={styles.card}>
        <Card.Body className='card-login'>
          <Logo />
          <Card.Title>Inicio de Sesión</Card.Title>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="NeoThe Matrix" value={username} onChange={(e) => setUsername(e.target.value)} required className={styles.input} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Contraseña" className={styles.input} />
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