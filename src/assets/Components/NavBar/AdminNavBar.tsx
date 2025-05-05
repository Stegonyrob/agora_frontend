import { logout } from "@/redux/reducers/loginSlice";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Logo from "../Logo/LogoSimply";
import styles from "./NavBar.module.scss";

function AdminNavBar() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/login";
    };

    return (
        <Navbar
            expand="lg"
            className="navbar border-bottom border-body"
            data-bs-theme="dark"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
            <Container>
                <Navbar.Brand href="#home">
                    <Logo className={styles.logoSmall} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="underline" defaultActiveKey="/home" className="ms-auto">
                        {/* Dropdown 1: Editable Views */}
                        <NavDropdown title="Editable Views" id="editable-views-dropdown">
                            <NavDropdown.Item href="/Agora">Agora</NavDropdown.Item>
                            <NavDropdown.Item href="/Services">Servicios</NavDropdown.Item>
                            <NavDropdown.Item href="/AboutMe">Sobre Mi</NavDropdown.Item>
                        </NavDropdown>

                        {/* Dropdown 2: Neurodiversidad */}
                        <NavDropdown title="Neurodiversidad" id="neurodiversity-dropdown">
                            <NavDropdown.Item href="/Neurodiversity">¿Qué es?</NavDropdown.Item>
                            <NavDropdown.Item href="/Tea">Cea/Tea</NavDropdown.Item>
                            <NavDropdown.Item href="/Tda_Tdh">Tda_Tdh</NavDropdown.Item>
                            <NavDropdown.Item href="/LearningDifficulties">
                                Dificultades del Aprendizaje
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/DevelopmentConditions">
                                Condiciones del Desarrollo
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/Communication">
                                Trastornos de la Comunicación
                            </NavDropdown.Item>
                        </NavDropdown>

                        {/* Dropdown 3: Blog */}
                        <NavDropdown title="Blog" id="blog-dropdown">
                            <NavDropdown.Item href="/Blog">Blog</NavDropdown.Item>
                            <NavDropdown.Item href="/Login">Login</NavDropdown.Item>
                            <NavDropdown.Item href="/Register">Registro</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminNavBar;