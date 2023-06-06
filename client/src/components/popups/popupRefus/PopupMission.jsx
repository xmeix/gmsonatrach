import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FormControlLabel, FormGroup } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import useBtn from "../../../hooks/useBtn";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
export const ItemDiv = ({ label, content }) => (
  <div className="itemDiv">
    <div className="item-label">{label}</div>
    <div className="item-content">{content}</div>
  </div>
);
const PopupMission = ({ item }) => {
  const [tasks, setTasks] = useState(item.taches);
  const tasksRef = useRef(item.taches);

  const [handleClick] = useBtn();
  const currentUser = useSelector((state) => state.auth.user);
  const belongs = () =>
    item.employes.some((employee) => employee._id === currentUser._id);
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
    tasksRef.current = newTasks;
  };
  const renderBudgetComponent = () => {
    if (
      item.etat === "terminée" &&
      ["secretaire", "directeur", "responsable"].includes(currentUser.role)
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
                currentUser.role
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
              content={Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.tDateDeb)
              )}
            />
            <ItemDiv
              label="Date fin mission"
              content={Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.tDateRet)
              )}
            />
            <ItemDiv label="Structure" content={item.structure} />
            <ItemDiv label="Type" content={item.type} />
            <ItemDiv label="Observation" content={item.observation || " / "} />
          </div>
          <div>
            <ItemDiv label="Budget" content={item.budget + " DA"} />
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
            content={Intl.DateTimeFormat(["ban", "id"]).format(
              new Date(item.createdAt)
            )}
          />
          <ItemDiv
            label="par"
            content={item.createdBy.nom + " " + item.createdBy.prenom}
          />
        </div>
        <div className="crea-container">
          <ItemDiv
            label="Dernière modification le"
            content={Intl.DateTimeFormat(["ban", "id"]).format(
              new Date(item.updatedAt)
            )}
          />
          <ItemDiv
            label="par"
            content={item.updatedBy.nom + " " + item.updatedBy.prenom}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupMission;
