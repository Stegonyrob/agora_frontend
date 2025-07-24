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
  const [modalText, setModalText] = useState<ITextItem | null>(null);

  // Fetch de textos
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const data = await new TextService().getAllTexts();
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
    console.log('[CardText] handleEdit - text:', text);
    setModalText({ ...text });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (modalText) {
      console.log('[CardText] handleSave - modalText antes de guardar:', modalText);
      try {
        console.log('[CardText] handleSave - llamando a updateText con:', {
          id: modalText.id,
          payload: {
            ...modalText,
            title: typeof modalText.title === "string" ? modalText.title : "",
            description: typeof modalText.description === "string" ? modalText.description : "",
            image: typeof modalText.image === "string" ? modalText.image : ""
          }
        });
        const updatedText = await new TextService().updateText(
          modalText.id,
          {
            ...modalText,
            title: typeof modalText.title === "string" ? modalText.title : "",
            description: typeof modalText.description === "string" ? modalText.description : "",
            image: typeof modalText.image === "string" ? modalText.image : ""
          }
        );
        console.log('[CardText] handleSave - updatedText recibido:', updatedText);
        setTexts((prevTexts: ITextItem[]) => {
          const nuevos = prevTexts.map((text: ITextItem) =>
            text.id === updatedText.id ? updatedText : text
          );
          console.log('[CardText] handleSave - nuevo estado texts:', nuevos);
          return nuevos;
        });
        setShowModal(false);
        setModalText(null);
      } catch (error) {
        console.error("Error updating text:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (modalText) {
      const nuevoModalText = { ...modalText, [e.target.name]: e.target.value };
      console.log('[CardText] handleChange - name:', e.target.name, 'value:', e.target.value, 'nuevoModalText:', nuevoModalText);
      setModalText(nuevoModalText);
    }
  };

  // Render
  return (
    <React.Fragment>
      {texts.filter((text: ITextItem) => ids.includes(text.id.toString())).length === 0 ? (
        <div className={styles.noDataMessage}>No hay datos disponibles.</div>
      ) : (
        <>
          {texts
            .filter((text: ITextItem) => ids.includes(text.id.toString()))
            .map((cardText: ITextItem, index: number) => (
              <div key={cardText.id}>
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
                        src={cardText.image || ""}
                        alt={cardText.description || "Default description"}
                        onError={handleImgLoadingError}
                        style={{ float: index % 2 === 0 ? "left" : "right" }}
                      />
                      <Card.Body>
                        <Card.Title className={styles.cardTitle}>
                          {cardText.title}
                        </Card.Title>
                        <Card.Text className={styles.cardDescription}>
                          {typeof cardText.description === "string"
                            ? cardText.description.split('\n').map((line, i) => (
                              <span key={i}>{line}<br /></span>
                            ))
                            : cardText.description}
                        </Card.Text>
                        {isAdmin && !viewAsUser && (
                          <Button
                            variant="primary"
                            onClick={() => handleEdit(cardText)}
                          >
                            Editar
                          </Button>
                        )}
                      </Card.Body>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </>
      )}
      {/* Modal de edición global, solo para admin y no en modo usuario */}
      {isAdmin && !viewAsUser && (
        <Modal show={showModal} onHide={() => { setShowModal(false); setModalText(null); }}>
          <Modal.Header closeButton>
            <Modal.Title>Edición de Contenido web</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalText ? (
              <Form>
                <Form.Group controlId="formImage">
                  <Form.Label>Imagen</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={modalText.image || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formTitle" className="mt-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="title"
                    value={typeof modalText.title === "string" || typeof modalText.title === "number" ? modalText.title : ""}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formDescription" className="mt-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={modalText.description || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setModalText(null); }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default CardText;