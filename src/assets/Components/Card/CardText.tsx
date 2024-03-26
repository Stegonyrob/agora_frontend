import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';
import "./CardText.scss";

interface TextItem {
 id: string;
 image: string;
 description: string;
}

interface CardTextProps {
 ids: string[];
}

function CardText({ ids }: CardTextProps) {
 const texts = useSelector((state: any) => state.text.texts);

 const filteredTexts = texts.filter((text: TextItem) => ids.includes(text.id));

 return (
    <div>
      <Card className='cardText mb-5'>
        {filteredTexts.map((currentText: TextItem, index: number) => (
          <div key={currentText.id} className={`card-item-${index}`}>
            <Card.Img variant="top" src={currentText.image} />
            <Card.Body>
              <Card.Text className='mt-3 p-2 text-justify'>
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