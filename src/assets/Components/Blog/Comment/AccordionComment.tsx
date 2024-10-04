import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

interface Comment {
  id: number;
  name: string;
  comment: string;
}

interface CommentAccordianProps {
  comments: Comment[];
}

function CommentAccordion({ comments }: CommentAccordianProps) {
  return (
    <Accordion defaultActiveKey="0">
      {comments.map((comment, index) => (
        <Accordion.Item eventKey={String(index)} key={index}>
          <Accordion.Header>{comment.name}</Accordion.Header>
          <Accordion.Body>
            <Card.Text>{comment.comment}</Card.Text>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default CommentAccordion;
