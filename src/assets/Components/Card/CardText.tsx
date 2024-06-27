import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import { useSelector } from "react-redux";
import "./CardText.scss";

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
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Card className="cardText mb-5">
          <Card.Body>
            <Card.Img variant="top" src="470x450" />
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
            </Placeholder>
          </Card.Body>
        </Card>
      ) : (
        <Card className="cardText mb-5">
          {texts.filter((text: TextItem) => ids.includes(text.id)).map((currentText: TextItem, index: number) => (
            <div key={currentText.id} className={`card-item-${index}`}>
              <Card.Img variant="top" src={currentText.image} alt={currentText.description} onError={handleImgLoadingError} />
              <Card.Body>
                <Card.Text className="mt-3 p-2 text-justify">
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