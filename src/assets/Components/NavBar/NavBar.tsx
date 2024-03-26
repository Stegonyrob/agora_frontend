import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './NavBar.scss';
function NavBar() {
  return (
    <Navbar expand="lg" className="navbar  border-bottom border-body" data-bs-theme="dark" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <Container>
        <Navbar.Brand href="#home">
          <img src="../../../../public/images/agoraLogo.png" className="logoNavbar"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav variant="underline" defaultActiveKey="/home" className="ms-auto">
          
            <Nav.Link  href="/">Home</Nav.Link>
            <Nav.Link href="/Agora">Agora</Nav.Link>
            <Nav.Link href="/Services">Servicios</Nav.Link>
            <NavDropdown title="Neurodiversidad" id="basic-nav-dropdown">
            <NavDropdown.Item href="/Neurodiversity">¿Qué es?</NavDropdown.Item>
              <NavDropdown.Item href="/Tea">Tea</NavDropdown.Item>
              <NavDropdown.Item href="/Tda_Tdh">Tda_Tdh</NavDropdown.Item>
              <NavDropdown.Item href="/Aprendizaje">Transtornos del Aprendizaje</NavDropdown.Item>
              <NavDropdown.Item href="/Madurativo">Transtornos Madurativos</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/AboutMe">Sobre Mi</Nav.Link>
            <NavDropdown title="Foro" id="basic-nav-dropdown">
            <NavDropdown.Item href="/Login">Login</NavDropdown.Item>
            <NavDropdown.Item href="/Register">Registro</NavDropdown.Item>
             </NavDropdown>
       
             </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
