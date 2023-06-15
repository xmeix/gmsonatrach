import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FormControlLabel, FormGroup } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import useBtn from "../../../hooks/useBtn";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { verifyProlongement } from "../../../utils/formFieldsVerifications";
export const ItemDiv = ({ label, content }) => (
  <div className="itemDiv">
    <div className="item-label">{label}</div>
    <div className="item-content">{content}</div>
  </div>
);
import usePop from "./../../../hooks/usePop";
const PopupMission = ({ item }) => {
  console.log("item======>", item);
  // const [tasks, setTasks] = useState(item.taches);
  const tasksRef = useRef(item.taches);

  const [handleClick] = useBtn();
  const { user } = useSelector((state) => state.auth);
  const { missions } = useSelector((state) => state.mission);
  const belongs = () =>
    item.employes.some((employee) => employee._id === user._id);
  const [budgetConsome, setBudgetConsomme] = useState(0);
  const handleCheck = (check, id) => {
    const newTasks = tasksRef.current.map((task) => {
      if (task._id === id) {
        return {
          ...task,
          state: check,
        };
      }
      return task;
    });

    handleClick("check", item, "mission", "", newTasks);
    tasksRef.current = newTasks; // Update tasksRef.current instead of tasks state
  };

  const renderBudgetComponent = () => {
    if (
      item.etat === "terminée" &&
      ["secretaire", "directeur", "responsable"].includes(user.role)
    ) {
      if (item.budgetConsome === 0 || item.budgetConsome === null) {
        return (
          <div className="itemDiv">
            <div className="item-label">Budget consommé</div>
            <div className="bgt">
              <input
                type="number"
                style={{
                  width: "100px",
                  height: "10px",
                }}
                min={0}
                onChange={(e) => setBudgetConsomme(e.target.value)}
              />
              {["secretaire", "directeur", "responsable"].includes(
                user.role
              ) && (
                <button
                  onClick={() => {
                    if (budgetConsome) {
                      handleClick("update", item, "mission", "", {
                        budgetConsome: budgetConsome,
                      });
                    }
                  }}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        );
      } else {
        return (
          <ItemDiv
            label="Budget Consomme"
            content={item.budgetConsome + " DA"}
          />
        );
      }
    }
    return null;
  };

  const CustomComponent = () => {
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [handleClick] = useBtn();

    const handleModify = () => {
      setError("");
      console.log("Modified date:", date);
      if (
        new Date(date).getTime() <= new Date(item.tDateDeb).getTime() ||
        new Date(date).getTime() <= new Date().getTime()
      ) {
        setError(
          "La date de fin de mission doit être postérieure à la date actuelle (ou la date de début de mission)."
        );
      } else {
        const error = verifyProlongement(item, {
          missions: missions,
          newDate: date,
        });
        if (error !== "") {
          console.log(error);
          setError(error);
        } else {
          // call api , and not forget that i need to emit a lot of things
          // first thing i have to change is the oldDuree
          // second thing is tDateRet
          handleClick("update", item, "mission", "", {
            tDateRet: new Date(date).toISOString(),
          });
        }
      }
    };

    return (
      <div className="custom-component">
        <div className="custom-component-input">
          <label>nouvelle date de fin</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        <button className="custom-component-button" onClick={handleModify}>
          Modifier
        </button>
      </div>
    );
  };
  // const { Pop, openPop } = usePop();

  return (
    <div className="popup-mission">
      <div className="title">Information mission</div>
      <div className="head">
        <h3>Object Mission: {item.objetMission}</h3>
        <div className="state">
          <div>
            <span>Etat:</span>
            <span className={`${item.etat}`}>{item.etat}</span>
          </div>
          <div>
            <span>Raison du refus:</span> {item.raisonRefus || "/"}
          </div>
        </div>
      </div>
      <>
        {" "}
        <span className="plus">Information sur la mission:</span>
        <div className="info-creation">
          <div>
            <ItemDiv
              label="Date debut mission"
              content={new Date(item.tDateDeb).toISOString().slice(0, 10)}
            />
            <ItemDiv
              label="Date fin mission"
              content={new Date(item.tDateRet).toISOString().slice(0, 10)}
            />
            <ItemDiv label="Structure" content={item.structure} />
            <ItemDiv label="Type" content={item.type} />
            <ItemDiv label="Observation" content={item.observation || " / "} />
          </div>
          <div>
            <ItemDiv
              label="Budget"
              content={item.budget ? item.budget : 0 + " DA"}
            />
            {renderBudgetComponent()}
          </div>
        </div>
      </>
      <div className="employes">
        <span className="tile">Employes:</span>
        <div className="list">
          {item.employes.map((emp, i) => (
            <li className="employe" key={i}>
              {emp.nom + " " + emp.prenom}
            </li>
          ))}
          {/* {(item.etat === "acceptée" || item.etat === "en-cours") && (
            <button className="width" onClick={handleAddEmploye}>
              <AddCircleRoundedIcon className="icon" />
            </button>
          )} */}
        </div>
      </div>
      <div className="taches">
        <span className="tile">Taches:</span>
        {tasksRef.current.map((tache, i) => (
          <div className="tache" key={i}>
            <div className="content">{tache.content}</div>
            <Checkbox
              disabled={item.etat !== "en-cours" || !belongs()}
              checked={tache.state === "accomplie"}
              onClick={() =>
                handleCheck(
                  tache.state === "accomplie" ? "non-accomplie" : "accomplie",
                  tache._id
                )
              }
            />
          </div>
        ))}
      </div>
      <>
        <span className="plus">Plus d'information sur la mission:</span>
        <div className="info-creation">
          <ItemDiv label="Pays" content={item.pays} />
          <ItemDiv
            label="Moyen de transport aller"
            content={item.moyenTransport.join(" - ")}
          />
          <ItemDiv
            label="Moyen de transport retour"
            content={item.moyenTransportRet.join(" - ")}
          />
          <ItemDiv label="Lieu de depart" content={item.lieuDep || "Alger"} />
          <ItemDiv label="lieu de destination" content={item.destination} />
        </div>
      </>
      <div className="info-creation info-last">
        <div className="crea-container">
          <ItemDiv
            label="Créé le"
            content={new Date(item.createdAt).toISOString().slice(0, 10)}
          />
          <ItemDiv
            label="par"
            content={item.createdBy.nom + " " + item.createdBy.prenom}
          />
        </div>
        <div className="crea-container">
          <ItemDiv
            label="Dernière modification le"
            content={new Date(item.updatedAt).toISOString().slice(0, 10)}
          />
          <ItemDiv
            label="par"
            content={item.updatedBy.nom + " " + item.updatedBy.prenom}
          />
        </div>
      </div>
      {/* <Pop
        title={"Modifier la date de fin de mission"}
        component={CustomComponent}
      /> */}
      {/* this pop should be shown only when mission en-cours / acceptée */}
      <div className="p-mission-btns">
        {/* <button onClick={openPop} className="btn">
          Modifier la date de fin de mission
        </button> */}
      </div>
    </div>
  );
};

export default PopupMission;
