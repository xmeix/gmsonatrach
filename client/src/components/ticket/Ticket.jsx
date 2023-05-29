import "./Ticket.css";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useAxios } from "../../hooks/useAxios";
import Comment from "../comment/Comment";
import CommentForm from "../comment/CommentForm";

const Ticket = ({
  id,
  objet,
  description,
  createdBy,
  createdAt,
  isSolved,
  commentaires,
}) => {
  const { callApi } = useAxios();
  const sortedComments = commentaires
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="ticket-container">
      <div className="ticket">
        <div className="ticket-header">
          <div className="ticket-title">{objet}</div>
          {isSolved && <div className="ticket-etat">cloturé</div>}
          {!isSolved && (
            <button
              className="ticket-etat ticket-etat-us"
              onClick={() => {
                callApi("patch", `/ticket/etat/${id}`, {});
              }}
            >
              cloturer
            </button>
          )}
        </div>
        <div className="ticket-description">{description}</div>
        <div className="ticket-meta">
          <div className="ticket-meta-item">
            <PersonRoundedIcon className="ticket-meta-icon" />
            <span className="ticket-meta-text">
              {createdBy.nom + " " + createdBy.prenom}
            </span>
          </div>
          <div className="ticket-meta-item">
            <AccessTimeRoundedIcon className="ticket-meta-icon " />
            <span className="ticket-meta-text">
              {new Date(createdAt).toLocaleDateString().split("/").join("-")}
            </span>
          </div>
        </div>
      </div>
      <CommentForm id={id} isDisabled={isSolved} />
      <div className="comments">
        {sortedComments?.map((com, i) => (
          <Comment
            key={i}
            contenu={com.contenu}
            createdAt={new Date(com.createdAt).getTime()}
            createdBy={com.createdBy}
          />
        ))}
      </div>
    </div>
  );
};

export default Ticket;
