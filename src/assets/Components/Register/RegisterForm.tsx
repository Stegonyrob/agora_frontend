import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import "./RegisterForm.scss";

function RegisterForm() {
  return (
    <Card className="text-center">
      <Card.Body>
        <Card.Title>Formulario de Registro</Card.Title>
        <FloatingLabel
          controlId="floatingInput"
          label="Nombre"
          className="mb-3"
        >
          <Form.Control type="text" placeholder="name" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Primer Apellido"
          className="mb-3"
        >
          <Form.Control type="text" placeholder="fisrtlastName" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Segundo Apellido"
          className="mb-3"
        >
          <Form.Control type="text" placeholder=" secundtlastName" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="NickName"
          className="mb-3"
        >
          <Form.Control type="text" placeholder="nickname" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Parentesco"
          className="mb-3"
        >
          <Form.Control type="text" placeholder="relationship" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control type="email" placeholder="name@example.com" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className="mb-3"
        >
          <Form.Control type="password" placeholder="Contraseña " />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className="mb-3"
        >
          <Form.Control type="password" placeholder=" Confirmar conttraseña" />
        </FloatingLabel>

        <Button variant="primary">Cancelar</Button>
        <Button variant="primary">Enviar</Button>
      </Card.Body>
    </Card>
  );
}

export default RegisterForm;
