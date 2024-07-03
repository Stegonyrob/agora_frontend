import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import { useSelector } from "react-redux";
import styles from './CardText.module.scss';

interface TextItem {
  id: string;
  image: string;
  description: string;
}

interface CardTextProps {
  ids: string[];
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.src = '../../img/agoraLogo.png';
}

function CardText({ ids }: CardTextProps) {
  const texts = useSelector((state: any) => state.text.texts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 180000);
    return () => clearTimeout(timer);
  }, []);

  return (


    <div >
      {isLoading ? (
        <Card.Body >
          <Card.Text className={styles.skeleton} >
            <Placeholder as={Card.Text} animation="glow" >
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
            <Placeholder as={Card.Text} animation="glow" >
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
      ) : (
        <Card className={styles.cardText}>
          {texts.filter((text: TextItem) => ids.includes(text.id)).map((currentText: TextItem, index: number) => (
            <div key={currentText.id} className={styles.cardText}>
              <Card.Img className={styles.cardText} src={currentText.image} alt={currentText.description} onError={handleImgLoadingError} />
              <Card.Body>
                <Card.Text className={styles.cardText}>
                  {currentText.description}
                </Card.Text>
              </Card.Body>
            </div>
          ))}
        </Card>
      )}

    </div>


  );
}

CardText.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CardText;