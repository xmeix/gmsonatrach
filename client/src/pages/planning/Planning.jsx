import { useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import usePopup from "../../hooks/usePopup";
import Popup from "../../components/popups/Popup";
import "./Planning.css";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { v4 as uuidv4 } from "uuid";

const Planning = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [savedItem, setSavedItem] = useState(null);
  const [isOpen, openPopup, closePopup, popupType] = usePopup();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");

  const date = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  }, [monthOffset]);
  const users = useSelector((state) => state.auth.users);
  const missions = useSelector((state) => state.auth.missions);
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const currentDay = new Date().getDate();

  const currentUser = useSelector((state) => state.auth.user);
  // const resources = useMemo(() => {
  //   if (currentUser.role === "employe") {
  //     return missions
  //       .filter(
  //         (mission) =>
  //           mission.etat === "acceptée" ||
  //           mission.etat === "en-cours" ||
  //           mission.etat === "terminée"
  //       )
  //       .map(({ _id, objetMission, structure }) => ({
  //         _id,
  //         objetMission,
  //         structure,
  //       }));
  //   } else {
  //     return users
  //       .filter((u) => u.role === "employe" || u.role === "responsable")
  //       .map(({ _id, nom, prenom, structure }) => ({
  //         _id,
  //         nom,
  //         prenom,
  //         structure,
  //       }));
  //   }
  // }, [currentUser, users, missions]);

  //"#FFF1C1", "#FDE2E2", "#F5E5EA", "#C9E4DE", "#E3F1E4"
  //"#FFE0B2", "#FFD180", "#FFCC80", "#FFB74D", "#FFA726"
  const COLORS = [
    "#FF9AA2", // coral red
    "#FFD700", // gold
    "#FFA07A", // light salmon
    "#FF7F50", // coral
    "#FFB6C1", // pink
    "#FFE4E1", // misty rose
    "#FFEFD5", // papaya whip
    "#FFEBCD", // blanched almond
    "#FFFACD", // lemon chiffon
    "#F0FFF0", // honeydew
    "#E6E6FA", // lavender
    "#F5DEB3", // wheat
    "#FFC0CB", // pink
    "#87CEEB", // sky blue
    "#ADD8E6", // light blue
    "#B0C4DE", // light steel blue
    "#87CEFA", // light sky blue
    "#AFEEEE", // pale turquoise
    "#E0FFFF", // light cyan
    "#FAFAD2", // light goldenrod yellow
  ];

  const acceptedMissions = useSelector((state) => {
    let count = 0; // initialize count variable
    if (currentUser.role === "employe") {
      return state.auth.missions
        .filter(
          (mission) =>
            mission.etat === "acceptée" ||
            mission.etat === "en-cours" ||
            mission.etat === "terminée"
        )
        .flatMap((mission) => {
          const color = COLORS[count % COLORS.length]; // use count variable to get color from array
          count++; // increment count
          return {
            mission: mission,
            employe: currentUser,
            start: mission.tDateDeb,
            end: mission.tDateRet,
            color: color,
          };
        });
    } else {
      return state.auth.missions
        .filter(
          (mission) =>
            mission.etat === "acceptée" ||
            mission.etat === "en-cours" ||
            mission.etat === "terminée"
        )
        .flatMap((mission) =>
          mission.employes.map((emp) => {
            const color = COLORS[count % COLORS.length]; // use count variable to get color from array
            count++; // increment count
            return {
              mission: mission,
              employe: emp,
              start: mission.tDateDeb,
              end: mission.tDateRet,
              color: color,
            };
          })
        );
    }
  });
  const handlePreviousMonth = useCallback(() => {
    setMonthOffset((prevOffset) => prevOffset - 1);
  }, []);
  const handleNextMonth = useCallback(() => {
    setMonthOffset((prevOffset) => prevOffset + 1);
  }, []);
  const isMissionDay = useCallback(
    (day, mission) => {
      const start = new Date(mission.start);
      const end = new Date(mission.end);
      const current = new Date(date.getFullYear(), date.getMonth(), day);
      return (
        current >=
          new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
        current <= end
      );
    },
    [date]
  );
  const memoizedIsMissionDay = useMemo(() => isMissionDay, [isMissionDay]);
  const handleCloseForm = () => {
    console.log("are closing");
    setSavedItem(null);
    closePopup();
  };
  const filteredResources = useMemo(() => {
    let filteredResources = [];

    if (currentUser.role === "employe") {
      filteredResources = missions
        .filter(
          (mission) =>
            (filter === "" || mission.structure === filter) &&
            (mission.etat === "acceptée" ||
              mission.etat === "en-cours" ||
              mission.etat === "terminée")
        )
        .map(({ _id, objetMission, structure }) => ({
          _id,
          objetMission,
          structure,
        }));
    } else {
      filteredResources = users
        .filter((u) => u.role === "employe" || u.role === "responsable")
        .filter(({ nom, prenom, structure }) => {
          const search = searchQuery.toLowerCase().trim();
          const fullName = `${nom.toLowerCase()} ${prenom.toLowerCase()}`;
          return (
            fullName.includes(search) && (filter === "" || structure === filter)
          );
        })
        .map(({ _id, nom, prenom, structure }) => ({
          _id,
          nom,
          prenom,
          structure,
        }));
    }

    return filteredResources;
  }, [currentUser, users, missions, searchQuery, filter]);
  const structures = useMemo(() => {
    const excludedStructures = ["SECRETARIAT", "DG", "RELEX"];
    const allStructures = users
      .filter(
        (u) =>
          (u.role === "employe" || u.role === "responsable") &&
          !excludedStructures.includes(u.structure)
      )
      .map(({ structure }) => structure);
    return Array.from(new Set(allStructures));
  }, [users]);

  return (
    <div className="planning">
      <div className="tab">
        {" "}
        <div className="departmentName">
          Projet SH-ONE : Planning de mobilisation des missions
        </div>
        <div className="schedule-head">
          <button onClick={handlePreviousMonth} className="planning-btn">
            <ArrowBackIosRoundedIcon className="icn" />
          </button>
          <button onClick={handleNextMonth} className="planning-btn">
            <ArrowForwardIosRoundedIcon className="icn" />
          </button>
          <p>
            {date.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="planning-control">
            <div className="search-container">
              <div className="label">Rechercher:</div>
              <input
                type="text"
                id="searchBox"
                className="search-box"
                placeholder="ex: nom prénom"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-container">
              <div className="label">Filtrer par:</div>
              <select
                id="selectFilter"
                className="select-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">toutes les structures</option>
                {structures.map((structure) => (
                  <option value={structure} key={structure}>
                    {structure}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="ov" style={{ overflowX: "scroll", height: 450 }}>
          <table
            className="planning-table"
            style={{
              overflowX: "scroll !important",
            }}
          >
            <thead className="planning-thead">
              <tr className="planning-trow">
                {currentUser.role !== "employe" && (
                  <>
                    <th className="planning-th">Resource</th>
                    <th className="planning-th">Structure</th>
                  </>
                )}
                {currentUser.role === "employe" && (
                  <>
                    <th className="planning-th">Mission</th>
                    <th className="planning-th">Structure</th>
                  </>
                )}
                {[...Array(daysInMonth)].map((_, index) => (
                  <th
                    key={index}
                    className={`planning-th${
                      currentDay === index + 1 ? " current-day" : ""
                    }`}
                  >
                    {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="planning-tbody">
              {currentUser.role === "employe" &&
                filteredResources.map(({ _id, objetMission, structure }) => (
                  <tr key={uuidv4()} className="planning-tbody-row">
                    <td className="planning-tbody-td-res">{objetMission}</td>
                    <td className="planning-tbody-td-res">{structure}</td>
                    {[...Array(daysInMonth)].map((_, index) => {
                      const day = index + 1;
                      const matchingMission = acceptedMissions.find(
                        (item) =>
                          item.mission._id === _id &&
                          memoizedIsMissionDay(day, item)
                      );

                      return (
                        <td
                          className={
                            matchingMission
                              ? "planning-mission"
                              : "planning-tbody-td"
                          }
                          key={index}
                          style={{
                            backgroundColor: matchingMission
                              ? matchingMission.color
                              : "white",
                          }}
                          onClick={() => {
                            if (matchingMission) {
                              setSavedItem(matchingMission?.mission);
                              openPopup("mission");
                            }
                          }}
                        >
                          {matchingMission ? (
                            <div className="planning-mission"></div>
                          ) : (
                            ""
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              {currentUser.role !== "employe" &&
                filteredResources.map(({ _id, nom, prenom, structure }) => (
                  <tr key={uuidv4()} className="planning-tbody-row">
                    <td className="planning-tbody-td-res">
                      {nom + " " + prenom}
                    </td>
                    <td className="planning-tbody-td-res">{structure}</td>
                    {[...Array(daysInMonth)].map((_, index) => {
                      const day = index + 1;
                      const matchingMission = acceptedMissions.find(
                        (item) =>
                          item.employe._id === _id &&
                          memoizedIsMissionDay(day, item)
                      );

                      return (
                        <td
                          className={
                            matchingMission
                              ? "planning-mission"
                              : "planning-tbody-td"
                          }
                          key={index}
                          style={{
                            backgroundColor: matchingMission
                              ? matchingMission.color
                              : "white",
                          }}
                          onClick={() => {
                            if (matchingMission) {
                              setSavedItem(matchingMission?.mission);
                              openPopup("mission");
                            }
                          }}
                        >
                          {matchingMission ? (
                            <div className="planning-mission"></div>
                          ) : (
                            ""
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <>
          <Popup
            item={savedItem}
            type="mission"
            isOpen={isOpen}
            closePopup={closePopup}
            popupType={popupType}
          />
        </>
      )}

      {isOpen && <div className="closePopup" onClick={handleCloseForm}></div>}
    </div>
  );
};

export default Planning;
