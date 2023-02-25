import Liste from "../../components/liste/Liste";
import Input from "../../components/form/input/Input";
import Button from "../../components/form/button/Button";
import NavBar from "../../components/navbar/NavBar";
import PageName from "../../components/pageName/PageName";
import "./GestionMission.css";
const GestionMission = () => {
  return (
    <div className="gestionMissions">
      <PageName name="gestion Mission" />
      <div className="elements">
        <div className="formGM">
          <div className="formTitle">Formulaire d'ajout mission</div>
          <div className="inputs">
            <div className="inside">
              <Input label="Objet mission" width="80%" />
              <Input label="Type mission" width="80%" />
            </div>
            <div className="inside">
              <Input label="Budget mission" width="80%" />
              <Input label="Moyen de transport" width="80%" />
            </div>

            {/* <div className="inside">
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
            </div> */}
          </div>
          <div className="buttons">
            <Button label="Annuler" />
            <Button label="Suivant" type={1} />
          </div>
        </div>
        <div className="listeGM">
          <Liste title="Liste des missions" search="mission id"/>
        </div>
      </div>
    </div>
  );
};

export default GestionMission;
