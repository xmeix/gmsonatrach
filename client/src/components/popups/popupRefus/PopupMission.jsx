import { FormControlLabel, FormGroup } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import useBtn from "../../../hooks/useBtn";
import { useSelector } from "react-redux";

const PopupMission = ({ item }) => {
  const [tasks, setTasks] = useState(item.taches);
  const [handleClick] = useBtn();
  const currentUser = useSelector((state) => state.auth.user);
  const belongs = () => {
    return item.employes.some((employee) => employee._id === currentUser._id);
  };
  const handleCheck = (check, id) => {
    const newTasks = tasks.map((task) => {
      if (task._id === id) {
        return {
          ...task,
          state: check, // update the `accomplie` property based on the checkbox value
        };
      }
      return task; // return the unchanged task for all other IDs
    });

    handleClick("check", item, "mission", "", newTasks);
    setTasks(newTasks);
  };

  const ItemDiv = ({ label, content }) => {
    return (
      <div className="itemDiv">
        <div className="item-label">{label}</div>
        <div className="item-content">{content}</div>
      </div>
    );
  };

  return (
    <div className="popup-mission">
      <div className="title">Information mission</div>
      <div className="head">
        <h3>Object Mission: {item.objetMission}</h3>
        <div className="state">
          <div>
            <span>Etat:</span>
            <span
              style={{
                color:
                  item.etat === "en-attente"
                    ? "var(--orange)"
                    : item.etat === "acceptée"
                    ? "var(--success)"
                    : "var(--error)",
                fontWeight: "600",
              }}
            >
              {item.etat}
            </span>
          </div>
          <div>
            <span>Raison du refus:</span> {item.raisonRefus || "/"}
          </div>
          {/* {item.etat === "refusée" && (
          <div>
            <span>Raison du refus:</span> {item.raisonRefus}
          </div>
        )} */}
        </div>
      </div>
      <div className="info-creation">
        <div>
          <ItemDiv
            label="Date debut mission"
            content={Intl.DateTimeFormat(["ban", "id"]).format(
              new Date(item.tDateDeb)
            )}
          />{" "}
          <ItemDiv
            label="Date fin mission"
            content={Intl.DateTimeFormat(["ban", "id"]).format(
              new Date(item.tDateRet)
            )}
          />
          <ItemDiv label="Structure" content={item.structure} />{" "}
          <ItemDiv label="Type" content={item.type} />{" "}
          <ItemDiv label="Observation" content={item.observation || " / "} />{" "}
        </div>
        <div>
          <ItemDiv label="Budget" content={item.budget + " DA"} />{" "}
          {item.budgetConsome === 0 ? (
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
                />
                <button>OK</button>
              </div>
            </div>
          ) : (
            <ItemDiv
              label="Budget Consomme"
              content={item.budgetConsome + " DA"}
            />
          )}
        </div>
      </div>

      <div className="employes">
        <span>Employes:</span>
        {item.employes.map((emp, i) => (
          <li className="employe" key={i}>
            {emp.nom + " " + emp.prenom}
          </li>
        ))}
      </div>
      <div className="taches">
        <span>Taches:</span>
        {tasks.map((tache, i) => (
          <div className="tache" key={i}>
            <div className="content">{tache.content}</div>

            <Checkbox
              disabled={
                item.etat !== "en-cours" || belongs() === false ? true : false
              }
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

      <div className="info-creation">
        <ItemDiv label="Pays" content={item.pays} />{" "}
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

      <div className="info-creation">
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
