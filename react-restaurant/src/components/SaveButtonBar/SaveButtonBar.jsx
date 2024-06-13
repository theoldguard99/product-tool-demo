import React, { useState } from "react";
import { Button, Box, Dialog, DialogActions, DialogTitle } from "@mui/material";
import "./SaveButtonBar.css";

const SaveButtonBar = ({
  onSave,
  onEdit,
  onCancel,
  onDelete,
  isEditing,
  hasDetails,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    onDelete();
    handleCloseDeleteDialog();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        mt={2}
        className="save-button-bar"
      >
        {isEditing ? (
          <>
            <Button variant="contained" color="primary" onClick={onSave}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </>
        ) : hasDetails ? (
          <>
            <Button variant="contained" color="primary" onClick={onEdit}>
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenDeleteDialog}
            >
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={onSave}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </>
        )}
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this item?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaveButtonBar;
