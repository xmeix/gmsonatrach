import { FormControlLabel, FormGroup } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import useBtn from "../../../hooks/useBtn";
import { useSelector } from "react-redux";
import { OmLabelLine } from "./PopupOM";

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
      <div className="info">
        <div>
          <OmLabelLine
            label="Date debut mission"
            content={
              ": " +
              Intl.DateTimeFormat(["ban", "id"]).format(new Date(item.tDateDeb))
            }
          />{" "}
          <OmLabelLine
            label="Date fin mission"
            content={
              ": " +
              Intl.DateTimeFormat(["ban", "id"]).format(new Date(item.tDateRet))
            }
          />
          <OmLabelLine label="Structure" content={": " + item.structure} />{" "}
          <OmLabelLine label="Type" content={": " + item.type} />{" "}
          <OmLabelLine
            label="Observation"
            content={": " + (item.observation || " / ")}
          />{" "}
        </div>
        <div>
          <OmLabelLine label="Budget" content={": " + item.budget + " DA"} />{" "}
          <OmLabelLine
            label="Budget Consomme"
            content={
              ": " + item.budgetConsome === 0 ? (
                <input
                  type="number"
                  style={{
                    width: "100px",
                    height: "10px",
                  }}
                  min={0}
                />
              ) : (
                ": " + item.budgetConsome + " DA"
              )
            }
          />
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
        <OmLabelLine label="Pays" content={": " + item.pays} />{" "}
        <OmLabelLine
          label="Moyen de transport aller"
          content={": " + item.moyenTransport.join(" - ")}
        />
        <OmLabelLine
          label="Moyen de transport retour"
          content={": " + item.moyenTransportRet.join(" - ")}
        />
        <OmLabelLine label="Lieu de depart" content={": " + item.lieuDep} />
        <OmLabelLine label="Destination" content={": " + item.destination} />
        <OmLabelLine
          label="Circonscription Administrative"
          content={": " + (item.circonscriptionAdm || " / ")}
        />
      </div>

      <div className="info-creation">
        <div className="crea-container">
          <OmLabelLine
            label="Créé le"
            content={
              ": " +
              Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.createdAt)
              )
            }
          />
          <OmLabelLine
            label="par"
            content={": " + item.createdBy.nom + " " + item.createdBy.prenom}
          />
        </div>

        <div className="crea-container">
          <OmLabelLine
            label="Dernière modification le"
            content={
              ": " +
              Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.updatedAt)
              )
            }
          />
          <OmLabelLine
            label="par"
            content={": " + item.updatedBy.nom + " " + item.updatedBy.prenom}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupMission;
