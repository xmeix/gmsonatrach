import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FormControlLabel, FormGroup, Tooltip } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import useBtn from "../../../hooks/useBtn";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ModeRoundedIcon from "@mui/icons-material/ModeRounded";
import { verifyProlongement } from "../../../utils/formFieldsVerifications";
export const ItemDiv = ({ label, content }) => (
  <div className="itemDiv">
    <div className="item-label">{label}</div>
    <div className="item-content">{content}</div>
  </div>
);
import "./../../../components/formulaire/Formulaire.css";

import usePopDate from "../../../hooks/usePopDate";
const PopupMission = ({ item }) => {
  // console.log("item======>", item);
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
  const [date, setDate] = useState(item.tDateRet);

  const CustomComponent = ({ close, date }) => {
    const [error, setError] = useState("");
    const [handleClick] = useBtn();
    const [selectedDate, setSelectedDate] = useState(new Date(date));

    const handleModify = () => {
      setError("");
      console.log("Modified date:", selectedDate);

      if (
        selectedDate.getTime() <= new Date(item.tDateDeb).getTime() ||
        selectedDate.getTime() <= new Date().getTime()
      ) {
        setError(
          "La date de fin de mission doit être postérieure à la date actuelle (ou la date de début de mission)."
        );
      } else {
        const error = verifyProlongement(item, {
          missions: missions,
          newDate: selectedDate,
        });
        if (error !== "") {
          console.log(error);
          setError(error);
        } else {
          handleClick("update", item, "mission", "", {
            tDateRet: selectedDate.toISOString(),
          });
          close();
        }
      }
    };

    const handleDateChange = (e) => {
      const inputValue = e.target.value;
      const newDate = inputValue ? new Date(inputValue) : null;

      setSelectedDate(newDate);
    };

    return (
      <div className="custom-component">
        <div className="custom-component-input">
          <label>Nouvelle date de fin</label>
          <div className="flex inpuy">
            <div>
              <input
                type="date"
                value={
                  selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                }
                onChange={handleDateChange}
              />
              {error && <div className="input-error">{error}</div>}
            </div>
            <Tooltip title="Modifier">
              <ModeRoundedIcon className="icn black" onClick={handleModify} />
            </Tooltip>
          </div>
        </div>
        <div className="custom-component-info">
          Ancienne date: {new Date(item.tDateRet).toISOString().split("T")[0]}
        </div>
      </div>
    );
  };

  const { isOpenDate, openPopDate, closePopDate } = usePopDate();
  return (
    <div className="popup-mission">
      <div className="title">Information mission</div>
      <div className="head">
        <h3>ID Mission: {item.uid}</h3>
        <h3>Objet: {item.objetMission}</h3>
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
            {!isOpenDate && (
              <div className="flex">
                <ItemDiv
                  label="Date fin mission"
                  content={new Date(date).toISOString().slice(0, 10)}
                />
                {(item.etat === "en-cours" || item.etat === "acceptée") &&
                  user.role !== "employe" &&
                  user.role !== "relex" && (
                    <div className="p-mission-btns">
                      <Tooltip title=" Modifier la date de fin de mission">
                        <ModeRoundedIcon
                          className="icn black"
                          onClick={openPopDate}
                        />
                      </Tooltip>
                    </div>
                  )}
              </div>
            )}
            {isOpenDate && <CustomComponent date={date} close={closePopDate} />}
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
            content={item?.createdBy?.nom + " " + item?.createdBy?.prenom}
          />
        </div>
        <div className="crea-container">
          <ItemDiv
            label="Dernière modification le"
            content={new Date(item.updatedAt).toISOString().slice(0, 10)}
          />
          <ItemDiv
            label="par"
            content={item?.updatedBy?.nom + " " + item?.updatedBy?.prenom}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupMission;
