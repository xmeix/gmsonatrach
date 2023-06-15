import { ticketEntries as Entries, userButtons } from "../../data/formData";
import "./AddTicketForm.css"; // Import the CSS file
import "./../../components/formulaire/Formulaire.css";
import { useAxios } from "../../hooks/useAxios";
import { useState } from "react";
import { useSelector } from "react-redux";
const AddTicketForm = () => {
  const [objet, setObjet] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const { callApi } = useAxios();
  const { missions } = useSelector((state) => state.mission);
  const { user } = useSelector((state) => state.auth);

  const handleAddTicket = () => {
    if (objet !== "" && description !== "") {
      setErrors({});
      const ticket = {
        object: objet,
        description,
        employe: user,
        mission: missions.find(
          (mission) =>
            mission.employes.some((employe) => employe._id === user._id) &&
            mission.etat === "en-cours"
        ),
      };
      console.log(ticket);
      callApi("post", "/ticket", ticket);
      setDescription("");
      setObjet("");
    } else {
      const newErrors = {};
      if (objet === "") {
        newErrors.objet = "obligatoire";
      }
      if (description === "") {
        newErrors.description = "obligatoire";
      }
      setErrors(newErrors);
      console.log(errors);
    }
  };

  return (
    <div className="addTicketForm ">
      <div className="form-title">Ouvrir ticket</div>
      <div className="field">
        <label className="label-field">{Entries[0].label}</label>
        <input
          className="input-field"
          placeholder={Entries[0].placeholder}
          type={Entries[0].inputType}
          onChange={(e) => {
            setObjet(e.target.value);
          }}
          name={Entries[0].id}
        />
        {errors["objet"] && (
          <div className="input-error" style={{ alignSelf: "flex-end" }}>
            {errors["objet"]}
          </div>
        )}
      </div>
      <div className="field">
        <label className="label-field">{Entries[1].label}</label>
        <textarea
          placeholder={Entries[1].placeholder}
          rows={5}
          // cols={10}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          name={Entries[1].id}
        />
        {errors["description"] && (
          <div className="input-error" style={{ alignSelf: "flex-end" }}>
            {errors["description"]}
          </div>
        )}
      </div>{" "}
      <button onClick={handleAddTicket}>Lancer</button>
    </div>
  );
};

export default AddTicketForm;
