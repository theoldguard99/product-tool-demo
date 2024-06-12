import React from "react";
import { Button, Box } from "@mui/material";
import "./SaveButtonBar.css";

const SaveButtonBar = ({
  onSave,
  onEdit,
  onCancel,
  onDelete,
  isEditing,
  hasDetails,
}) => {
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
        ) : (
          hasDetails && (
            <>
              <Button variant="contained" color="primary" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            </>
          )
        )}
      </Box>
    </>
  );
};

export default SaveButtonBar;
