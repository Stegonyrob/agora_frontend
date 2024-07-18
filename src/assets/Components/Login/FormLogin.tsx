// import React, { useEffect, useState } from 'react';
// import { Button, Card, Form } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setAuthentication } from '../../../redux/authSlice';
// import { RootState } from '../../../redux/store';
// import { login } from '../../../services/auth';
// import Logo from '../Logo/LogoSimply';
// import styles from './FormLogin.module.scss';


// interface FormLoginProps {
//   setLogin: (value: boolean) => void;
//   setRegister: (value: boolean) => void;
//   setUserId: (value: string) => void;
//   setUserName: (value: string) => void;
//   setRole: (value: string) => void;
// }



// const FormLogin: React.FC<FormLoginProps> = () => {
//   const [username, setUsername] = useState('');
//   const [userId, setUserId] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

//   useEffect(() => {
//     console.log('isAuthenticated:', isAuthenticated);
//   }, [isAuthenticated]);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     console.log('Iniciando envío de formulario');
//     event.preventDefault();
//     setUserId(userId);
//     try {
//       console.log('Enviando credenciales a servidor');
//       const { accessToken, refreshToken, userId, role } = await login(username, password);
//       console.log(accessToken, refreshToken, userId, role)
//       console.log('Servidor ha respondido con éxito');
//       localStorage.setItem('authToken', accessToken);
//       localStorage.setItem('refreshToken', refreshToken);
//       console.log(accessToken, refreshToken)
//       dispatch(setAuthentication({
//         isAuthenticated: true,
//         user: { userId, role },
//         role,
//         accessToken: accessToken,
//         userId: undefined
//       }));



//       console.log(userId);
//       console.log(role);
//       console.log('Redux ha actualizado el estado con éxito');
//       navigate('/blog', { state: { userId: userId.toString() } });
//       console.log('Navegación exitosa');
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };


//   return (
//     <form onSubmit={handleSubmit} >
//       <Card className={styles.card} >
//         <Card.Body className='card-login' >
//           <Logo />
//           <Card.Title>Inicio de Sesión</Card.Title>
//           <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
//             <Form.Label>Email</Form.Label>
//             <Form.Control type="text" placeholder="NeoThe Matrix" value={username} onChange={(e) => setUsername(e.target.value)} required className={styles.input} />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="exampleForm.ControlInput" >
//             <Form.Label>Contraseña</Form.Label>
//             <Form.Control type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Contraseña" className={styles.input} />
//           </Form.Group>
//           <div className="d-grid gap-2">
//             <Button
//               variant="light"
//               size="lg"
//               type="submit"
//               className={`${styles.button} text-bg-info`}
//             >
//               Enviar
//             </Button>
//           </div>
//         </Card.Body>
//         <Card.Footer className="text-center">
//           No tienes cuenta <a href="/register">Regístrate Aquí</a>
//         </Card.Footer>
//       </Card>
//     </form>
//   );
// };

// export default FormLogin;
import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { setCredentials } from '../../../redux/authSlice';
import Logo from '../Logo/LogoSimply';
import styles from './FormLogin.module.scss';

interface FormLoginProps {
  setLogin: (value: boolean) => void;
  setRegister: (value: boolean) => void;
  setUserId: (value: string) => void;
  setUserName: (value: string) => void;
  setRole: (value: string) => void;

}


const FormLogin: React.FC<FormLoginProps> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login: loginHandler, isAuthenticated } = useAuth();
  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log('Iniciando envío de formulario');
    event.preventDefault();
    setUserId(userId);
    try {
      console.log('Enviando credenciales a servidor');
      const { accessToken, refreshToken, userId, role } = await loginHandler(username, password);
      console.log(accessToken, refreshToken, userId, role)
      console.log('Servidor ha respondido con éxito');
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log(accessToken, refreshToken)

      // Verificar que el token se esté guardando correctamente
      let claves = Object.keys(localStorage);
      for (let clave of claves) {
        console.log(`${clave}: ${localStorage.getItem(clave)}`);
      }

      dispatch(setCredentials({
        isAuthenticated: true,
        user: { userId, role },
        role,
        accessToken: accessToken,
        userId: undefined
      }));


      console.log(userId);
      console.log(role);
      console.log('Redux ha actualizado el estado con éxito');
      navigate('/blog', { state: { userId: userId.toString() } });
      console.log('Navegación exitosa');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      <Card className={styles.card} >
        <Card.Body className='card-login' >
          <Logo />
          <Card.Title>Inicio de Sesión</Card.Title>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="NeoThe Matrix" value={username} onChange={(e) => setUsername(e.target.value)} required className={styles.input} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput" >
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



