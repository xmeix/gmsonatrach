import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageName from "../../components/pageName/PageName";
import "./Planning.css";
import uuid from "react-uuid";
import { render } from "react-dom";

const Planning = () => {
  const missions = useSelector((state) => state.auth.missions);
  const Acceptedmissions = missions.filter(
    (mission) => mission.etat === "acceptée"
  );
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const [days, setDays] = useState([]);

  const employees = useSelector((state) => state.auth.users);

  function prevMonth() {
    const prevDate = new Date(date.getFullYear(), date.getMonth() - 1);
    setDate(prevDate);
  }

  function nextMonth() {
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1);
    setDate(nextDate);
  }

  useEffect(() => {
    const renderDays = () => {
      const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();

      let days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      setDays(days);
    };

    renderDays();
  }, [date]);

  const checkMissions = (day, employe) => {
    const miss = Acceptedmissions.some((m) => {
      if (
        m.employes.includes(employe.id) &&
        new Date(year, month, day) >= new Date(m.tDateDeb) &&
        new Date(year, month, day) <= new Date(m.tDateRet)
      ) {
        return true;
      } else {
        return false;
      }
    });
    return miss;
  };

  return (
    <div className="planning">
      <PageName name="Planification" />
      <div className="departmentName">Projet SH-ONE</div>
      <div className="planningTitle">Planning de mobilisation des missions</div>
      <div className="schedule">
        <div className="months">
          <button className="btn" onClick={prevMonth}>
            Prev
          </button>
          <span>{`${
            monthsOfYear[date.getMonth()]
          } ${date.getFullYear()}`}</span>
          <button className="btn" onClick={nextMonth}>
            Next
          </button>
        </div>
        <div className="calendar">
          <div className="element">
            <th className="title">employé</th>
            {employees.map((emp) => (
              <div className="postElement" key={uuid()}>
                {emp.nom}
              </div>
            ))}
          </div>
          <div className="element">
            <th className="title">Stream</th>
            {employees.map((emp) => (
              <div className="postElement" key={uuid()}>
                {emp.structure}
              </div>
            ))}
          </div>
          <div className="element">
            <th className="title">
              {days.map((day) => (
                <div className="day" key={uuid()}>
                  {day}
                </div>
              ))}
            </th>
            {employees.map((employee) => (
              <div className="row" key={uuid()}>
                {days.map((day) => {
                  const miss = checkMissions(day, employee);
                  return (
                    <div className="mission" key={uuid()}>
                      {miss ? "Y" : "X"}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;
