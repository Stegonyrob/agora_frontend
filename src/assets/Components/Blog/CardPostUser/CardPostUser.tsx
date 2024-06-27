import { ReactNode, useState } from 'react';

interface CardPostUserProps {
  children: ReactNode;
  postId: string;
}

export function CardPostUser({ children, postId }: CardPostUserProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{children}</h5>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <i className="bi bi-heart"></i> {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target={`#replyModal-${postId}`}
          >
            <i className="bi bi-chat-right-text"></i> Reply
          </button>
          <div
            className="modal fade"
            id={`replyModal-${postId}`}
            tabIndex={-1}
            aria-labelledby="replyModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="replyModalLabel">Reply to post</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="replyTextarea" className="form-label">Reply text</label>
                      <textarea className="form-control" id="replyTextarea" rows={3}></textarea>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary">Send reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
