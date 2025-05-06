import { ITextItem } from "@/core/texts/ITextItem";
import TextService from "@/core/texts/TextsService"; // Importa el servicio
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import { useSelector } from "react-redux";
import styles from "./CardText.module.scss";

interface CardTextProps {
  ids: string[];
  endpoint: string; // Endpoint para cargar los textos específicos de la vista
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.src = "../../img/agoraLogo.png";
}

function CardText({ ids, endpoint }: CardTextProps) {
  const { loggedUserRole } = useSelector((state: any) => state.login);
  const [texts, setTexts] = useState<ITextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentText, setCurrentText] = useState<ITextItem | null>(null);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const data = await new TextService().fetchTexts();
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
    setCurrentText(text);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (currentText) {
      try {
        const updatedText = await new TextService().updateText(
          currentText.id,
          currentText
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
                  src={currentText.image}
                  alt={currentText.description}
                  onError={handleImgLoadingError}
                  style={{ float: index % 2 === 0 ? "left" : "right" }}
                />
                <Card.Body>
                  <Card.Text className={styles.cardDescription}>
                    {currentText.description}
                  </Card.Text>
                  {loggedUserRole === "admin" && (
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
          <Modal.Title>Editar Texto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentText && (
            <Form>
              <Form.Group controlId="formImage">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={currentText.image}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mt-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={currentText.description}
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