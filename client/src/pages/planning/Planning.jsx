import { useState } from "react";
import { useSelector } from "react-redux";
import PageName from "../../components/pageName/PageName";
import "./Planning.css";
import uuid from "react-uuid";

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

  const employees = useSelector((state) => state.auth.users);

  function prevMonth() {
    const prevDate = new Date(date.getFullYear(), date.getMonth() - 1);
    setDate(prevDate);
  }

  function nextMonth() {
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1);
    setDate(nextDate);
  }

  // function renderDays() {
  //   const firstDayOfMonth = new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     1
  //   ).getDay();
  //   const daysInMonth = new Date(
  //     date.getFullYear(),
  //     date.getMonth() + 1,
  //     0
  //   ).getDate();

  //   let days = [];
  //   for (let i = 1; i <= daysInMonth; i++) {
  //     days.push(i);
  //   }

  //   let table = [];
  //   let fstRow = [];

  //   fstRow.push(
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Employee</th>
  //           <th>Stream</th>
  //           {days.map((day) => (
  //             <th key={uuid()}>{day}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {/* {employees.map((emp) =>
  //           emp ? (
  //             <tr key={emp.id}>
  //               <th>{emp.nom + " " + emp.prenom}</th>
  //             </tr>
  //           ) : null
  //         )} */}
  //       </tbody>
  //     </table>
  //   );

  //   //fstRow.push(days.map((i) => <th>{i}</th>));
  //   //table.push(<thead>{fstRow}</thead>);

  //   return table;
  // }

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
        <div className="days"> </div>
      </div>
    </div>
  );
};

export default Planning;
