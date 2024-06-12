import React, { useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./SaveButtonBar.css";

const SaveButtonBar = ({ onSave, onClear }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    navigate("/products");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (confirm) => {
    setOpen(false);
    if (confirm) {
      onClear();
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        mt={2}
        className="save-button-bar"
      >
        <Button variant="contained" color="inherit" onClick={handleCancel}>
          Cancel
        </Button>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
          >
            Clear
          </Button>
          <Button variant="contained" color="primary" onClick={onSave}>
            Save
          </Button>
        </Box>
      </Box>
      <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>{"Clear Inputs"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear all inputs?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleClose(true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaveButtonBar;
