import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';
import "./CardText.scss";

// Definición de la interfaz para los objetos dentro de texts
interface TextItem {
 id: string;
 image: string;
 description: string;
}

// Definición de la propiedad ids
interface CardTextProps {
 ids: string[];
}

function CardText({ ids }: CardTextProps) {
 const texts = useSelector((state: any) => state.text.texts);

 // Filtrar los textos basados en los IDs proporcionados
 const filteredTexts = texts.filter((text: TextItem) => ids.includes(text.id));

 return (
    <div>
      <Card className='cardText'>
        {filteredTexts.map((currentText: TextItem, index: number) => (
          <div key={currentText.id} className={`card-item-${index}`}>
            <Card.Img variant="top" src={currentText.image} />
            <Card.Body>
              <Card.Text className='mt-5 text-justify'>
                {currentText.description}
              </Card.Text>
            </Card.Body>
          </div>
        ))}
      </Card>
    </div>
 );
}

CardText.propTypes = {
 ids: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CardText;