import { ITextItem } from "@/core/texts/ITextItem";
import TextService from "@/core/texts/TextsService"; // Importa el servicio
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
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.src = "../../img/agoraLogo.png";
}

function CardText({ ids, endpoint }: CardTextProps) {
  console.log("Rendering CardText component");
  const userRole = sessionStorage.role;
  const isLoggedIn = sessionStorage.isLoggedIn;

  const [texts, setTexts] = useState<ITextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentText, setCurrentText] = useState<ITextItem | null>(null);

  useEffect(() => {
    const fetchTexts = async () => {
      console.log("Fetching texts...");
      try {
        const data = await new TextService().fetchTexts();
        console.log("Fetched texts:", data);
        setTexts(data);
      } catch (error) {
        console.error("Error fetching texts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTexts();
  }, [endpoint]);

  const handleEdit = (text: ITextItem) => {
    console.log("Editing text:", text);
    setCurrentText(text);
    setShowModal(true);
  };

  const handleSave = async () => {
    console.log("Saving text:", currentText);
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
        console.log("Updated text:", updatedText);
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
    console.log("Changing input:", e.target.name, e.target.value);
    if (currentText) {
      setCurrentText({ ...currentText, [e.target.name]: e.target.value });
    }
  };

  return (
    <div>
      {isLoading ? (
        <Card.Body>
          <Card.Text className={styles.skeleton}>
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
                  float: `left`,
                  marginLeft: "3rem",
                  marginBottom: "2rem",
                  marginRight: "3rem",
                }}
              />
              <Placeholder xs={8} style={{ marginLeft: "2rem" }} />
              <Placeholder xs={8} style={{ marginLeft: "2rem" }} />
            </Placeholder>
          </Card.Text>
        </Card.Body>
      ) : (
        <div className={styles.cardContainer}>
          {texts
            .filter((text: ITextItem) => ids.includes(text.id.toString()))
            .map((currentText: ITextItem, index: number) => (
              <div key={currentText.id} className={styles.cardText}>
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
                    {currentText.description}
                  </Card.Text>
                  {userRole === "ROLE_ADMIN" && (
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(currentText)}
                    >
                      Editar
                    </Button>
                  )}
                </Card.Body>
              </div>
            ))}
        </div>
      )}

      {/* Modal for Editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edición de Contenido web</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentText && (
            <Form>
              <Form.Group controlId="formImage">

                <Form.Group controlId="formTitle" className="mt-3">
                  <Form.Label>Titúlo</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="title"
                    value={typeof currentText.title === "string" || typeof currentText.title === "number" ? currentText.title : ""}

                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={currentText.image || ""}
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
  );
}

export default CardText;