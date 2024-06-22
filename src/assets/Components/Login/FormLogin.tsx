import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../../core/auth/AuthRepository';
import { loginUser } from '../../redux/userSlice';
import Logo from '../Logo/LogoSimply';
import styles from './FormLogin.module.scss';
interface AuthResponse {
  data: {
    token: string;
    userId: string;
    role: string;
  };
}
const FormLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await authenticateUser(username, password) as unknown as AuthResponse;
      if (!response || !response.data) throw new Error('Authentication failed or unexpected response format');
      const { token, userId, role } = response.data;
      localStorage.setItem('authToken', token);

      dispatch(loginUser({ userId, role }));
      navigate('/blogview', { state: { userId } });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Función para encriptar password con RSA
  const encryptRSA = (password: string) => {
    // Aquí iría la lógica de encriptación con RSA
    // Por ahora, simplemente devuelvo la password encriptada
    return password;
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