import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import InteractionAdminReply from './ReplyComment';

interface CommentType {
  id: number;
  name: string;
  comment: string;
}

interface CommentAccordianProps {
  comments: CommentType[];
}

function CommentAccordion({ comments }: CommentAccordianProps) {
  return (
    <Accordion defaultActiveKey="0">
      {comments.map((comment, index) => (
        <Accordion.Item eventKey={String(index)} key={index}>
          <Accordion.Header>{comment.name}</Accordion.Header>
          <Accordion.Body>
            <Card.Text>{comment.comment}</Card.Text>
            <InteractionAdminReply commentId={comment.id} />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default CommentAccordion;




