import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import AttendeesListModal from './AttendeesListModal';
import styles from './ViewAttendeesButton.module.scss';

interface ViewAttendeesButtonProps {
    eventId: number;
    eventTitle: string;
}

const ViewAttendeesButton: React.FC<ViewAttendeesButtonProps> = ({
    eventId,
    eventTitle
}) => {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleHide = () => setShowModal(false);

    return (
        <>
            <Button
                variant="info"
                onClick={handleShow}
                className={styles.viewAttendeesButton}
                title="Ver inscritos al evento"
            >
                <i className="bi bi-people-fill me-2"></i>
                Ver Inscritos
            </Button>

            <AttendeesListModal
                show={showModal}
                onHide={handleHide}
                eventId={eventId}
                eventTitle={eventTitle}
            />
        </>
    );
};

export default ViewAttendeesButton;
