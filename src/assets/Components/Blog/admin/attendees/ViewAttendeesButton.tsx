import React, { lazy, Suspense, useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from './ViewAttendeesButton.module.scss';

const AttendeesListModal = lazy(() => import('./AttendeesListModal'));

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
                {' '}
                Ver inscritos
            </Button>

            {showModal && (
                <Suspense fallback={null}>
                    <AttendeesListModal
                        show={showModal}
                        onHide={handleHide}
                        eventId={eventId}
                        eventTitle={eventTitle}
                    />
                </Suspense>
            )}
        </>
    );
};

export default ViewAttendeesButton;
