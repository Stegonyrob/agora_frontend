import { logout } from '@/redux/reducers/loginSlice';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Logo from '../Logo/LogoSimply';
import styles from './NavBar.module.scss';

function NavBar() {
  const dispatch = useDispatch();
  const isAdmin = sessionStorage.role === "ROLE_ADMIN";
  const viewAsUser = sessionStorage.viewAsUser === "true";
  const handleLogout = () => {
    // Limpia sessionStorage
    sessionStorage.clear();

    // Limpia cookies (esto borra todas las cookies del dominio actual)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Despacha la acción de Redux
    dispatch(logout());
  };

  return (
    <Navbar expand="lg" className="navbar  border-bottom border-body" data-bs-theme="dark" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <Container>
        <Navbar.Brand href="#home">
          <Logo className={styles.logoSmall} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav variant="underline" defaultActiveKey="/home" className="ms-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/Agora">Agora</Nav.Link>
            <Nav.Link href="/Services">Servicios</Nav.Link>
            <Nav.Link href="/Events">Eventos</Nav.Link>
            <NavDropdown title="Neurodiversidad" id="basic-nav-dropdown">
              <NavDropdown.Item href="/Neurodiversity">¿Qué es?</NavDropdown.Item>
              <NavDropdown.Item href="/Tea">Cea/Tea</NavDropdown.Item>
              <NavDropdown.Item href="/Tda_Tdh">Tda_Tdh</NavDropdown.Item>
              <NavDropdown.Item href="/LearningDifficulties">Dificultades del Aprendizaje</NavDropdown.Item>
              <NavDropdown.Item href="/DevelopmentConditions">Condiciones del Desarrollo</NavDropdown.Item>
              <NavDropdown.Item href="/Communication">Trastornos de la Comunicación</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/AboutMe">Sobre Mi</Nav.Link>
            <NavDropdown title="Blog" id="basic-nav-dropdown">
              <NavDropdown.Item href="/Blog">Blog</NavDropdown.Item>
              <NavDropdown.Item href="/Login">Login</NavDropdown.Item>
              <NavDropdown.Item href="/Register">Registro</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
            {isAdmin && (
              <Nav.Link
                href="/admin"
                className={styles.adminDashboardLink}
                onClick={() => sessionStorage.removeItem("viewAsUser")}
              >
                Volver al Dashboard Admin
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;