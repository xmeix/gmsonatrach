import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

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
          hasMission: true,
        }))
      )
  );
  console.log(acceptedMissions);

  const handlePreviousMonth = () => {
    setMonthOffset((prevOffset) => prevOffset - 1);
  };

  const handleNextMonth = () => {
    setMonthOffset((prevOffset) => prevOffset + 1);
  };

  const isMissionDay = (day, mission) => {
    const start = new Date(mission.start);
    const end = new Date(mission.end);
     return (
      start.getDate() <= day &&
      end.getDate() >= day &&
      start.getMonth() === date.getMonth()
    );
  };

  return (
    <div>
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
                const missionExists = acceptedMissions.some(
                  (item) => item.employe._id === _id && isMissionDay(day, item)
                );

                return (
                  <td
                    key={index}
                    style={{
                      backgroundColor: missionExists ? "green" : "white",
                    }}
                  >
                    {missionExists ? "Mission" : ""}
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
