import { useState, useEffect } from "react";

const usePopDate = () => {
  const [isOpenDate, setIsOpenDate] = useState(false);
 
  const openPopDate = () => {
    setIsOpenDate(true);
  };

  const closePopDate = () => {
    setIsOpenDate(false);
  };

 
  return {isOpenDate, openPopDate, closePopDate};
};

export default usePopDate;
