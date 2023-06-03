import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

// const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
//   "& .MuiAlert-root": {
//     backgroundColor: "#f44336", // Customize the background color
//     color: "#fff", // Customize the text color
//     borderRadius: "4px", // Customize the border radius
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Customize the box shadow
//     marginBottom: theme.spacing(2), // Customize the bottom margin
//   },
// }));

const useMessage = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const showMessage = (message, severity) => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
  };

  const closeMessage = () => {
    setOpen(false);
  };

  const Message = () => (
    <Snackbar open={open} autoHideDuration={3000} onClose={closeMessage}>
      <MuiAlert
        onClose={closeMessage}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );

  return [Message, showMessage];
};

export default useMessage;
