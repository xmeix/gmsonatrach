import { useState } from "react";

const useDateFilter = (type, data) => {
  // initialize state with current month
  const [filterDate, setFilterDate] = useState(new Date());
  const maxDate = new Date();
  const [disablePrev, setDisabledPrev] = useState(false);

  // create a function to handle next month button click
  const handleNextIntervalClick = () => {
    if (type === 3) {
      setFilterDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        return nextDate;
      });
    } else if (type === 1) {
      setFilterDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setFullYear(nextDate.getFullYear() + 5);
        return nextDate;
      });
    } else if (type === 2) {
      setFilterDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        return nextDate;
      });
    }
  };
  const handlePrevIntervalClick = () => {
    if (type === 3) {
      setFilterDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setMonth(nextDate.getMonth() - 1);
        return nextDate;
      });
    } else if (type === 1) {
      setFilterDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setFullYear(nextDate.getFullYear() - 5);
        return nextDate;
      });
    } else if (type === 2) {
      setFilterDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setFullYear(nextDate.getFullYear() - 1);
        return nextDate;
      });
    }
  };

  // filter data based on current month state
  const filteredData = data
    .filter((item) => {
      if (type === 3) {
        const itemDate = new Date(item.day);
        return (
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
        );
      } else if (type === 1) {
        const itemDate = new Date(item.day);
        return (
          itemDate.getFullYear() >= filterDate.getFullYear() - 4 &&
          itemDate.getFullYear() <= filterDate.getFullYear()
        );
      } else if (type === 2) {
        const itemDate = new Date(item.day);
        return itemDate.getFullYear() === filterDate.getFullYear();
      }
    })
    .sort((a, b) => a.day - b.day);

  // check if current date is same as max date
  const isMaxDate =
    type === 1
      ? filterDate.getFullYear() + 5 > maxDate.getFullYear()
      : type === 3
      ? filterDate.getFullYear() === maxDate.getFullYear() &&
        filterDate.getMonth() === maxDate.getMonth()
      : type === 2
      ? filterDate.getFullYear() === maxDate.getFullYear()
      : false;

  const isNoData = filteredData.length === 0;

  const renderButtons = () => (
    <>
      <button onClick={handlePrevIntervalClick}>Previous</button>
      <div className="cont">
        {type === 1 &&
          `${filterDate.getFullYear() - 4} - ${filterDate.getFullYear()}`}
        {type === 2 && `${filterDate.getFullYear()}`}

        {type === 3 &&
          `${new Date(filterDate).toLocaleString("fr-FR", {
            month: "long",
          })} ${filterDate.getFullYear()}`}
      </div>
      <button onClick={handleNextIntervalClick} disabled={isMaxDate}>
        Next
      </button>
    </>
  );
  return {
    filterDate,
    handleNextIntervalClick,
    handlePrevIntervalClick,
    filteredData,
    setFilterDate,
    isMaxDate,
    isNoData,
    renderButtons,
  };
};

export default useDateFilter;
