import { useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import usePopup from "../../hooks/usePopup";
import Popup from "../../components/popups/Popup";
import "./Planning.css";
import PageName from "../../components/pageName/PageName";
const Planning = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [savedItem, setSavedItem] = useState(null);
  const [isOpen, openPopup, closePopup, popupType] = usePopup();
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

  const currentUser = useSelector((state) => state.auth.user);
  const resources = useMemo(() => {
    if (currentUser.role === "employe") {
      return missions
        .filter(
          (mission) =>
            mission.etat === "acceptée" ||
            mission.etat === "en-cours" ||
            mission.etat === "terminée"
        )
        .map(({ _id, objetMission, structure }) => ({
          _id,
          objetMission,
          structure,
        }));
    } else {
      return users
        .filter((u) => u.role === "employe" || u.role === "responsable")
        .map(({ _id, nom, prenom, structure }) => ({
          _id,
          nom,
          prenom,
          structure,
        }));
    }
  }, [currentUser, users, missions]);

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

  return (
    <div className="planning">
      <PageName name="Planification" />
      <div className="departmentName">Projet SH-ONE</div>
      <div className="planningTitle">Planning de mobilisation des missions</div>
      <div className="tab">
        <div className="schedule-head">
          <button onClick={handlePreviousMonth}>Previous Month</button>
          <p>
            {date.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <button onClick={handleNextMonth}>Next Month</button>
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
                  <th key={index} className="planning-th">
                    {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="planning-tbody">
              {currentUser.role === "employe" &&
                resources.map(({ _id, objetMission, structure }) => (
                  <tr key={_id} className="planning-tbody-row">
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
                resources.map(({ _id, nom, prenom, structure }) => (
                  <tr key={_id} className="planning-tbody-row">
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
