import Liste from "../../components/liste/Liste";
import Input from "../../components/form/input/Input";
import Button from "../../components/form/button/Button";
import NavBar from "../../components/navbar/NavBar";
import PageName from "../../components/pageName/PageName";
import "./GestionMission.css";
import { useState } from "react";
import Select from "react-select";
const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "1px solid var(--light-gray)", // Change the border color here
  }),
};
const GestionMission = () => {
  const [visibility, setVisibility] = useState(1);

  const options = [
    { value: "BOUALOUACHE Lamia", label: "BOUALOUACHE Lamia" },
    { value: "MOUSLI Amina", label: "MOUSLI Amina" },
    { value: "AID Feriel", label: "AID Feriel" },
  ];

  const changeVisibility = () => {
    setVisibility(visibility + 1);
    console.log(visibility);
  };
  return (
    <div className="gestionMissions">
      <PageName name="gestion Mission" />
      <div className="elements">
        <div className="formGM">
          <div className="formTitle">Formulaire d'ajout mission</div>
          {visibility === 1 && (
            <div className="inputs">
              <div className="inside">
                <Input label="Objet mission" width="80%" />
                <Input label="Type mission" width="80%" />
              </div>
              <div className="inside">
                <Input label="Budget mission" width="80%" />
                <Input label="Moyen de transport" width="80%" />
              </div>
            </div>
          )}

          {visibility === 2 && (
            <div className="inputs">
              <div className="inside">
                <Input label="Pays" width="80%" />
                <Input label="Destination" width="80%" />
              </div>
              <div className="outside">
                <p>Date de début</p>
                <div className="inside">
                  <div>
                    <Input label="Départ" type="date" width="85%" />
                    <Input label="Heure" type="time" width="70%" />
                  </div>
                  <div>
                    <Input label="Arrivé" type="date" width="85%" />
                    <Input label="Heure" type="time" width="70%" />
                  </div>
                </div>
              </div>
              <div className="outside">
                <p>Date de fin</p>
                <div className="inside">
                  <div>
                    <Input label="Départ" type="date" width="85%" />
                    <Input label="Heure" type="time" width="70%" />
                  </div>
                  <div>
                    <Input label="Arrivé" type="date" width="85%" />
                    <Input label="Heure" type="time" width="70%" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {visibility === 3 && (
            <div className="inputs">
              <Select options={options} isMulti styles={customStyles} />

              <div className="inside">
                <Input label="Task" width="80%" />
                <ul className="tasks"></ul>
              </div>
            </div>
          )}
          <div className="buttons">
            <button className="btn" onClick={() => setVisibility(1)}>
              Annuler
            </button>
            <button className="btn" onClick={changeVisibility}>
              Suivant
            </button>
          </div>
        </div>
        <div className="listeGM">
          <Liste title="Liste des missions" search="mission id" />
        </div>
      </div>
    </div>
  );
};

export default GestionMission;
