import { useState, useEffect } from "react";

const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState("");

  function openPopup(type) {
    setIsOpen(true);
    setPopupType(type);
  }

  function closePopup() {
    setIsOpen(false);
    setPopupType("");
  }

  return [isOpen, openPopup, closePopup, popupType];
};

export default usePopup;
