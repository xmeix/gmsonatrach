import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

const usePop = () => {
  const [open, setOpen] = useState(false);

  const openPop = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Pop = ({ title, component }) => (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{React.createElement(component)}</DialogContent>
      </Dialog>
    </div>
  );

  return { Pop, openPop, handleClose };
};

export default usePop;
