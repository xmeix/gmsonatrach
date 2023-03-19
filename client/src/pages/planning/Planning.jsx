import { useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import randomColor from "randomcolor";

const Planning = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const date = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const users = useSelector((state) => state.auth.users);
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const resources = useMemo(
    () => users.map(({ _id, nom }) => ({ _id, nom })),
    [users]
  );

  const acceptedMissions = useSelector((state) =>
    state.auth.missions
      .filter((mission) => mission.etat === "acceptée")
      .flatMap((mission) =>
        mission.employes.map((emp) => ({
          mission: mission,
          employe: emp,
          start: mission.tDateDeb,
          end: mission.tDateRet,
          color: randomColor({
            luminosity: "light",
            format: "hex",
          }),
        }))
      )
  );

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
      const current = new Date(date.getFullYear(), date.getMonth(), day+1);
      if (start.getDate() === day) console.log("start: " + day);
      if (end.getDate() === day) console.log("end: " + day);
      return current >= start && current <= end;
    },
    [date]
  );

  const memoizedIsMissionDay = useMemo(() => isMissionDay, [isMissionDay]);

  return (
    <div style={{ overflow: "scroll" }}>
      <button onClick={handlePreviousMonth}>Previous Month</button>
      <button onClick={handleNextMonth}>Next Month</button>
      <table>
        <thead>
          <tr>
            <th>Resource</th>
            {[...Array(daysInMonth)].map((_, index) => (
              <th key={index}>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map(({ _id, nom }) => (
            <tr key={_id}>
              <td>{nom}</td>
              {[...Array(daysInMonth)].map((_, index) => {
                const day = index + 1;
                const matchingMission = acceptedMissions.find(
                  (item) =>
                    item.employe._id === _id && memoizedIsMissionDay(day, item)
                );
                return (
                  <td
                    key={index}
                    style={{
                      backgroundColor: matchingMission
                        ? matchingMission.color
                        : "white",
                    }}
                  >
                    {matchingMission ? (
                      <div className="case-mission">mission</div>
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
  );
};

export default Planning;
