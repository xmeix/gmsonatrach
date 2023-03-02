import "./../../../css/Gestion.css";
import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
 import Input from "../../../components/form/input/Input";
import PageName from "../../../components/pageName/PageName";
import TableM from "../../../components/table/TableM";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid var(--light-gray)",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1);",
    "&:hover": {
      border: "1px solid var(--light-gray)",
    },
    "&:focus": {
      border: "1px solid var(--light-gray)",
    },
  }),
};

const GestionMission = () => {
  const [visibility, setVisibility] = useState(1);
  const options = [
    { value: "BOUALOUACHE Lamia", label: "BOUALOUACHE Lamia" },
    { value: "MOUSLI Amina", label: "MOUSLI Amina" },
    { value: "AID Feriel", label: "AID Feriel" },
  ];
  const filterOptions = ["etat", "moyen de transport"];

  const changeVisibility = () => {
    setVisibility(visibility + 1);
    console.log(visibility);
  };
  const AddMission = () => {
    setVisibility(1);
  };

  const Predire = () => {
    console.log("prediction");
  };
  return (
    <div className="gestion">
      <PageName name="gestion Missions" />
      <div className="elements">
        <div className="form">
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
              <div className="element">
                <label>employés</label>
                <Select
                  options={options}
                  isMulti
                  placeholder="ajouter employé"
                  styles={customStyles}
                />
              </div>

              <div className="element">
                <label>Taches</label>
                <CreatableSelect
                  isMulti
                  placeholder="créer tache"
                  options={options}
                  styles={customStyles}
                />
              </div>
            </div>
          )}
          {visibility === 4 && (
            <div className="inputs">
              <div className="inside">
                <Input label="Observation" width="100%" />
              </div>
              <div className="inside">
                <Input label="Circonscription admin" width="100%" />
              </div>
            </div>
          )}
          <div className="buttons">
            <button className="btn" onClick={() => setVisibility(1)}>
              Annuler
            </button>
            {visibility === 4 && (
              <button className="btn" onClick={Predire}>
                Prédire
              </button>
            )}
            {visibility === 4 && (
              <button className="btn" onClick={AddMission}>
                Ajouter
              </button>
            )}
            {visibility !== 4 && (
              <button className="btn" onClick={changeVisibility}>
                Suivant
              </button>
            )}
          </div>
        </div>
        <TableM
          title="Liste des missions"
          search={["id"]}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default GestionMission;
