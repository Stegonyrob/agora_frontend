import { ITextItem } from "@/core/texts/ITextItem";
import TextService from "@/core/texts/TextService";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import styles from "./CardText.module.scss";

interface CardTextProps {
  ids: string[];
  endpoint: string;
  asviewAsUser?: boolean;
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.src = "../../img/agoraLogo.png";
}

const CardText: React.FC<CardTextProps> = ({ ids, endpoint }) => {
  // Obtención de roles y modo usuario
  const userRole = sessionStorage.getItem("role");
  const viewAsUser = sessionStorage.getItem("viewAsUser") === "true";
  const isAdmin = userRole === "ROLE_ADMIN";

  // Estados
  const [texts, setTexts] = useState<ITextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentText, setCurrentText] = useState<ITextItem | null>(null);

  // Fetch de textos
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        // Usa el método correcto según tu servicio
        const data = await new TextService().getAllTexts(); // O fetchTexts(), pero debe devolver el array mostrado en Swagger
        setTexts(data);
      } catch (error) {
        console.error("Error fetching texts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTexts();
  }, [endpoint]);

  // Handlers
  const handleEdit = (text: ITextItem) => {
    setCurrentText(text);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (currentText) {
      try {
        const updatedText = await new TextService().updateText(
          currentText.id,
          {
            ...currentText,
            title: typeof currentText.title === "string" ? currentText.title : "",
            content: "",
            author: ""
          }
        );
        setTexts((prevTexts) =>
          prevTexts.map((text) =>
            text.id === updatedText.id ? updatedText : text
          )
        );
        setShowModal(false);
      } catch (error) {
        console.error("Error updating text:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentText) {
      setCurrentText({ ...currentText, [e.target.name]: e.target.value });
    }
  };
  console.log("IDs esperados:", ids);
  console.log("Textos recibidos:", texts);
  // Render
  return (
    <div>
      {texts.filter((text: ITextItem) => ids.includes(text.id.toString())).length === 0 ? (
        <div className={styles.noDataMessage}>No hay datos disponibles.</div>
      ) : (
        texts
          .filter((text: ITextItem) => ids.includes(text.id.toString()))
          .map((currentText: ITextItem, index: number) => (
            <div key={currentText.id}>
              {isLoading ? (
                <Card.Body>
                  <div className={styles.skeleton}>
                    <Placeholder
                      as={Card.Text}
                      animation="glow"
                      style={{ marginLeft: "3rem" }}
                    >
                      <Placeholder
                        xs={4}
                        style={{
                          width: "10rem",
                          height: "10rem",
                          float: "left",
                          marginLeft: "3rem",
                          marginBottom: "2rem",
                          marginRight: "3rem",
                        }}
                      />
                      <Placeholder xs={8} style={{ marginLeft: "2rem" }} />
                      <Placeholder xs={8} style={{ marginLeft: "2rem" }} />
                    </Placeholder>
                  </div>
                </Card.Body>
              ) : (
                <div className={styles.cardContainer}>
                  <div className={styles.cardText}>
                    <Card.Img
                      className={styles.cardImage}
                      src={currentText.image || ""}
                      alt={currentText.description || "Default description"}
                      onError={handleImgLoadingError}
                      style={{ float: index % 2 === 0 ? "left" : "right" }}
                    />
                    <Card.Body>
                      <Card.Title className={styles.cardTitle}>
                        {currentText.title}
                      </Card.Title>
                      <Card.Text className={styles.cardDescription}>
                        {typeof currentText.description === "string"
                          ? currentText.description.split('\n').map((line, i) => (
                            <span key={i}>{line}<br /></span>
                          ))
                          : currentText.description}
                      </Card.Text>
                      {isAdmin && !viewAsUser && (
                        <Button
                          variant="primary"
                          onClick={() => handleEdit(currentText)}
                        >
                          Editar
                        </Button>
                      )}
                    </Card.Body>
                  </div>
                </div>
              )}

              {/* Modal de edición */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Edición de Contenido web</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {currentText && (
                    <Form>
                      <Form.Group controlId="formImage">
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control
                          type="text"
                          name="image"
                          value={currentText.image || ""}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formTitle" className="mt-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="title"
                          value={
                            typeof currentText.title === "string" ||
                              typeof currentText.title === "number"
                              ? currentText.title
                              : ""
                          }
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formDescription" className="mt-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={currentText.description || ""}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Form>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    Guardar
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          ))
      )}
    </div>
  );
};

export default CardText;