import "./Ticket.css";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
const Ticket = ({ objet, description, createdBy, createdAt, isSolved }) => {
  return (
    <div className="ticket">
      <div className="ticket-header">
        <div className="ticket-title">{objet}</div>
        {isSolved && <div className="ticket-etat">cloturé</div>}
        {!isSolved && (
          <button className="ticket-etat ticket-etat-us">cloturer</button>
        )}
      </div>
      <div className="ticket-description">{description}</div>
      <div className="ticket-meta">
        <div className="ticket-meta-item">
          <PersonRoundedIcon className="ticket-meta-icon" />
          <span className="ticket-meta-text">{createdBy}</span>
        </div>
        <div className="ticket-meta-item">
          <AccessTimeRoundedIcon className="ticket-meta-icon " />
          <span className="ticket-meta-text">
            {new Date(createdAt).toLocaleDateString().split("/").join("-")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
