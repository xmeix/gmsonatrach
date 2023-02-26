import { useState } from "react";
import PageName from "../../../components/pageName/PageName";
import "./Planning.css";
const Planning = () => {
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

  function prevMonth() {
    const prevDate = new Date(date.getFullYear(), date.getMonth() - 1);
    setDate(prevDate);
  }

  function nextMonth() {
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1);
    setDate(nextDate);
  }

  function renderDays() {
    const firstDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    let days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    let rows = [];
    let cells = [];
    cells.push(<th key={0}>employé</th>);
    days.forEach((day, index) => {
      cells.push(<th key={index}>{day}</th>);
    });

    rows.push(<tr key={daysInMonth}>{cells}</tr>);
    return rows;
  }
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
        <table className="days">
          <thead>{renderDays()}</thead>
        </table>
      </div>
    </div>
  );
};

export default Planning;
