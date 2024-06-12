import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ProductsImageStyles.css";

const ProductImage = ({
  onImageChange,
  maxWidth = 1280,
  maxHeight = 720,
  imageUrl,
  disabled,
}) => {
  const [, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(imageUrl || null);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    setImagePreview(imageUrl);
  }, [imageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/jpeg") {
        setError("Only JPEG format is allowed");
        setSnackbarOpen(true);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width > maxWidth || img.height > maxHeight) {
            setError(
              `Image dimensions should not exceed ${maxWidth}x${maxHeight} pixels`
            );
            setSnackbarOpen(true);
          } else {
            setImage(file);
            setImagePreview(reader.result);
            setError("");
            if (onImageChange) {
              onImageChange(file);
            }
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    document.getElementById("image-input").value = null;
    if (onImageChange) {
      onImageChange(null);
    }
  };

  return (
    <>
      <Card className="card-container">
        <CardHeader
          title={
            <span className="bold-title">
              Product Image <span className="optional-text">(Optional)</span>
            </span>
          }
        />
        <Divider fullWidth />
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <input
              accept="image/jpeg"
              style={{ display: "none" }}
              id="image-input"
              type="file"
              onChange={handleImageChange}
              disabled={disabled}
            />
            <label htmlFor="image-input">
              {!imagePreview && (
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  disabled={disabled}
                >
                  <PhotoCamera />
                </IconButton>
              )}
            </label>
            {imagePreview && (
              <Box mt={2} position="relative">
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={{ width: "100%", maxWidth: "200px" }}
                />
                <IconButton
                  color="secondary"
                  aria-label="remove picture"
                  onClick={handleRemoveImage}
                  disabled={disabled}
                  style={{ position: "absolute", top: 0, right: 0 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              mt={2}
            >
              Image Upload Guidelines:
              <br />
              Accepted filetype is JPEG ONLY
              <br />
              Dimensions should be 1280 by 720 pixels
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductImage;
