import { IText } from "@/core/texts/IText";
import React from "react";
import { Modal } from "react-bootstrap";
import { useTextForm } from "../../../../../../hooks/useTextForm";
import TextBasicFields from "./components/TextBasicFields";
import TextFormActions from "./components/TextFormActions";
import TextImageManager from "./components/TextImageManager";
import styles from "./ModalForm.module.scss";

interface TextFormProps {
    text?: IText;
    onClose: () => void;
    onSubmit: (text: IText) => Promise<void>;
    show: boolean;
    userId?: number;
    mode: "create" | "edit";
}

const TextForm: React.FC<TextFormProps> = React.memo(({
    text,
    onClose,
    onSubmit,
    show,
    userId,
    mode
}) => {
    const {
        title, setTitle,
        message, setMessage,
        category, setCategory,
        imagePreviews,
        isSubmitting,
        globalError,
        handleImagesSelected,
        handleRemoveImage,
        submitForm
    } = useTextForm({ text: text, show, userId });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await submitForm(onSubmit, onClose);
    };

    return (
        <Modal size="lg" show={show} onHide={onClose} className={styles.modalForm} centered style={{ zIndex: 1055 }}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {text ? "✏️ Editar Texto" : "🎉 Crear Nuevo Texto"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {globalError && <div className={styles.globalError}>{globalError}</div>}

                    <TextBasicFields
                        title={title}
                        setTitle={setTitle}
                        message={message}
                        setMessage={setMessage}
                        category={category}
                        setCategory={setCategory}
                    />



                    <TextImageManager
                        imagePreviews={imagePreviews}
                        onImagesSelected={handleImagesSelected}
                        onRemoveImage={handleRemoveImage}
                    />


                    <TextFormActions
                        isSubmitting={isSubmitting}
                        text={text}
                        onClose={onClose}
                        mode={mode}
                    />
                </form>
            </Modal.Body>
        </Modal>
    );
});


export default TextForm;