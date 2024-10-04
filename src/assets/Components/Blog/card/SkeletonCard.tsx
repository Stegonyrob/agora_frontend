
import { Card, Placeholder } from 'react-bootstrap';

const SkeletonCard = () => {
    return (
        <Card.Body>
            <Card.Text>
                <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={4} style={{ width: '10rem', height: '10rem', float: `left`, marginLeft: '2rem', marginBottom: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={11} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={11} style={{ marginLeft: '2rem' }} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={4} style={{ width: '10rem', height: '10rem', float: `left`, marginLeft: '2rem', marginTop: '2rem', marginBottom: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem', marginTop: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={9} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={11} style={{ marginLeft: '2rem' }} />
                    <Placeholder xs={11} style={{ marginLeft: '2rem' }} />
                </Placeholder>
            </Card.Text>
        </Card.Body>
    );
};

export default SkeletonCard;