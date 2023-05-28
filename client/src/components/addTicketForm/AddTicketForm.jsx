import { ticketEntries as Entries, userButtons } from "../../data/formData";
import "./AddTicketForm.css"; // Import the CSS file
import "./../../components/formulaire/Formulaire.css";
const AddTicketForm = () => {
  return (
    <form className="addTicketForm ">
      <div className="form-title">Ouvrir ticket</div>
      <div className="field">
        <label className="label-field">{Entries[0].label}</label>
        <input
          className="input-field"
          placeholder={Entries[0].placeholder}
          type={Entries[0].inputType}
          onChange={(e) => {}}
          name={Entries[0].id}
        />
      </div>
      <div className="field">
        <label className="label-field">{Entries[1].label}</label>
        <textarea
          placeholder={Entries[1].placeholder}
          rows={5}
          // cols={10}
          onChange={() => {}}
          name={Entries[1].id}
        />
      </div>
      <button>Lancer</button>
    </form>
  );
};

export default AddTicketForm;
