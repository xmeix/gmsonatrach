import "./Comment.css";
const Comment = ({ contenu, createdBy, createdAt }) => {
  return (
    <div className="comment">
      <p className="comment-content">{contenu}</p>
      <div className="comment-metadata">
        <span className="comment-author">Posted by {createdBy.nom}</span>
        <span className="comment-date">
          {new Date(createdAt).toLocaleDateString().split("/").join("-")}
        </span>
      </div>
    </div>
  );
};

export default Comment;
