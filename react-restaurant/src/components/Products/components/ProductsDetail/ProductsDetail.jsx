import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../../../../firebaseConfig";
import { ref, get, update, remove } from "firebase/database";
import {
  Card,
  CardHeader,
  Divider,
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Typography,
  Select,
  FormHelperText,
  IconButton,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  isRequired,
  isPositiveNumber,
  hasNoSpecialCharacters,
  isMaxLength,
} from "../../validators";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorder from "@mui/icons-material/StarBorder";
import Star from "@mui/icons-material/Star";
import { useSnackbar } from "notistack";
import ProductImage from "../ProductsImage/ProductsImage";
import SaveButtonBar from "../../../SaveButtonBar/SaveButtonBar";
import "./ProductsDetailStyles.css";

const ProductsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const productRef = ref(database, `merchant/products/${id}`);
    get(productRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setProduct(snapshot.val());
        }
      })
      .catch((error) => {
        enqueueSnackbar("Error updating product: " + error.message, {
          variant: "error",
        });
      });
  }, [id]);

  const toggleFeatured = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      isFeatured: !prevProduct.isFeatured,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const formValidations = () => {
    const newErrors = {};
    if (!isRequired(product.name)) {
      newErrors.name = "Name is required";
    } else if (!hasNoSpecialCharacters(product.name)) {
      newErrors.name = "Name should not contain special characters";
    } else if (!isMaxLength(product.name, 255)) {
      newErrors.name = "Name should not exceed 255 characters";
    }
    if (!isRequired(product.category)) {
      newErrors.category = "Category is required";
    }
    if (!isPositiveNumber(product.price)) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!isPositiveNumber(product.cost)) {
      newErrors.cost = "Cost must be greater than 0";
    }
    if (!isPositiveNumber(product.amountInStock)) {
      newErrors.amountInStock = "Amount in Stock must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prevProduct) => ({
          ...prevProduct,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        imageUrl: "",
      }));
    }
  };

  const handleSave = () => {
    if (!formValidations()) {
      enqueueSnackbar("Some fields have incorrect inputs.", {
        variant: "error",
      });
      return;
    }
    const productRef = ref(database, `merchant/products/${id}`);
    update(productRef, product)
      .then(() => {
        enqueueSnackbar("Product updated successfully!", {
          variant: "success",
        });
        setIsEditing(false);
        navigate("/products");
      })
      .catch((error) => {
        enqueueSnackbar("Error updating product: " + error.message, {
          variant: "error",
        });
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const productRef = ref(database, `merchant/products/${id}`);
      remove(productRef)
        .then(() => {
          enqueueSnackbar("Product deleted successfully!", {
            variant: "success",
          });
          navigate("/products");
        })
        .catch((error) => {
          enqueueSnackbar("Error deleting product: " + error.message, {
            variant: "error",
          });
        });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const productCategories = [
    { value: "Meat", label: "Meat" },
    { value: "Poultry", label: "Poultry" },
    { value: "Dairy and Produce", label: "Dairy and Produce" },
    {
      value: "Frozen Fruits and Vegetables",
      label: "Frozen Fruits and Vegetables",
    },
    { value: "Dry Products", label: "Dry Products" },
    {
      value: "Non-Foods/Disposables/Smallwares",
      label: "Non-Foods/Disposables/Smallwares",
    },
    { value: "Beverage", label: "Beverage" },
  ];

  const productSize =
    product.category === "Non-Foods/Disposables/Smallwares"
      ? [{ value: "None", label: "None" }]
      : [
          { value: "Small", label: "Small" },
          { value: "Medium", label: "Medium" },
          { value: "Large", label: "Large" },
        ];

  return (
    <>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate("/products")} color="inherit">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          sx={{ ml: 1 }}
          className="chip-title"
        >
          Update Product
        </Typography>
      </Box>
      <Card className="card-container">
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <Typography variant="h6" component="span" className="bold-title">
                Product Details
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                className="tool-bar"
              >
                Featured this product
              </Typography>
              <IconButton
                onClick={toggleFeatured}
                color="default"
                disabled={!isEditing}
              >
                {product.isFeatured ? (
                  <Star className="yellow-icon" />
                ) : (
                  <StarBorder className="bordered-icon" />
                )}
              </IconButton>
            </Box>
          }
        />
        <Divider />
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                type="text"
                name="name"
                label="Name"
                value={product.name}
                onChange={handleChange}
                disabled={!isEditing}
                error={!!errors.name}
                helperText={errors.name}
                FormHelperTextProps={{ error: !!errors.name }}
                inputProps={{ maxLength: 255 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" disabled={!isEditing}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  label="Category"
                  value={product.category}
                  onChange={handleChange}
                >
                  {productCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.options}
                disabled={
                  !isEditing ||
                  product.category === "Non-Foods/Disposables/Smallwares"
                }
              >
                <InputLabel id="size-label">Size</InputLabel>
                <Select
                  labelId="size-label"
                  id="options"
                  name="options"
                  value={product.options}
                  onChange={handleChange}
                  label="Size"
                >
                  {productSize.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.options && (
                  <FormHelperText>{errors.options}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                type="number"
                name="price"
                label="Price"
                value={product.price}
                onChange={handleChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                }}
                error={!!errors.price}
                helperText={errors.price}
                FormHelperTextProps={{ error: !!errors.price }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                type="number"
                name="cost"
                label="Cost"
                value={product.cost}
                onChange={handleChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                }}
                error={!!errors.cost}
                helperText={errors.cost}
                FormHelperTextProps={{ error: !!errors.cost }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                type="number"
                name="amountInStock"
                label="Amount in Stock"
                value={product.amountInStock}
                onChange={handleChange}
                disabled={!isEditing}
                error={!!errors.amountInStock}
                helperText={errors.amountInStock}
                FormHelperTextProps={{ error: !!errors.amountInStock }}
              />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end"></Box>
        </Box>
      </Card>
      <ProductImage
        onImageChange={handleImageChange}
        imageUrl={product.imageUrl}
        isEditing={isEditing}
        disabled={!isEditing}
      />
      <SaveButtonBar
        onSave={handleSave}
        onEdit={() => setIsEditing(true)}
        onCancel={() => {
          setIsEditing(false);
        }}
        onDelete={handleDelete}
        isEditing={isEditing}
        hasDetails={!!product}
      />
    </>
  );
};

export default ProductsDetail;
