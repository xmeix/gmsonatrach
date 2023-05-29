import { useState } from "react";
import "./CommentForm.css";
import { useAxios } from "./../../hooks/useAxios";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useSelector } from "react-redux";
const CommentForm = ({ id, isDisabled }) => {
  const [commentText, setCommentText] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { callApi } = useAxios();
  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    // Implement your logic to handle submitting the comment
    // For example, you can call an API to save the comment
    console.log("Submitted comment:", commentText);
    const comment = {
      contenu: commentText,
      createdBy: user,
    };
    callApi("patch", `/ticket/comments/${id}`, comment);
    setCommentText("");
  };
  return (
    <form className="comment-form" onSubmit={handleSubmitComment}>
      <input
        type="text"
        value={commentText}
        onChange={handleCommentChange}
        placeholder="Suggérer une solution..."
        className={`comment-input ${isDisabled ? "disabled" : ""}`}
        disabled={isDisabled}
      />
      <button type="submit" className="comment-submit">
        <SendRoundedIcon className="icon " />
      </button>
    </form>
  );
};

export default CommentForm;
