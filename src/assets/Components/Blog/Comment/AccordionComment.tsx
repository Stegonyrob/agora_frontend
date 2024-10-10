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
  if (!comments) {
    throw new Error('Comments is null or undefined');
  }

  return (
    <Accordion defaultActiveKey="0">
      {comments.map((comment, index) => {
        if (!comment) {
          throw new Error('Comment is null or undefined');
        }

        return (
          <Accordion.Item eventKey={String(index)} key={index}>
            <Accordion.Header>{comment.name}</Accordion.Header>
            <Accordion.Body>
              <Card.Text>{comment.comment}</Card.Text>
              <InteractionAdminReply commentId={comment.id} />
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

export default CommentAccordion;




