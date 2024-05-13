
// IReply.ts
export interface IReply {
  postId: string;
  comment: string;
  user_id: string;
  reply_message: string;
  creation_date: string;
  reply_id: string;
  post_id: string;
}

// Define commentData as a type that matches IReply
type commentData = IReply;

// Example usage, assuming post and textareaValue are defined elsewhere
const post = { id: "somePostId" }; // Placeholder for post definition
const textareaValue = { value: "Some comment text" }; // Placeholder for textareaValue definition

const commentData: commentData = {
  postId: post.id,
  comment: textareaValue.value,
  user_id: "userId", // Replace with actual user ID
  reply_message: "replyMessage", // Replace with actual reply message
  creation_date: new Date().toISOString(), // Assuming creation_date is a string in ISO format
  reply_id: "replyId", // Replace with actual reply ID
  post_id: post.id, // Assuming post_id is the same as postId
};