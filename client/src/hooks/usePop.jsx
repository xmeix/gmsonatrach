import { useEffect, useState } from "react";

const usePop = () => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

  useEffect(() => {
    let timeout;

    if (message) {
      timeout = setTimeout(() => {
        setMessage("");
        setSeverity("");
      }, 4000);
    }

    return () => clearTimeout(timeout);
  }, [message]);

  const showPopupMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
  };

  const PopupMessage = () => {
    if (!message) {
      return null; // Hide the message component if there's no message
    }
    // useEffect(() => {
    //   if (message && severity) {
    //     showPopupMessage(message, severity);
    //   }
    // }, [message, severity]);

    return <div className={`${severity}-message`}>{message}</div>;
  };

  return { showPopupMessage, PopupMessage };
};

export default usePop;
