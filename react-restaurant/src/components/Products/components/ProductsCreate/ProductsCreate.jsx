import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../../../firebaseConfig";
import { ref, set, push } from "firebase/database";
import {
  Card,
  CardHeader,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import SaveButtonBar from "../../../SaveButtonBar/SaveButtonBar";
import {
  isRequired,
  isPositiveNumber,
  hasNoSpecialCharacters,
  isMaxLength,
} from "../../validators";
import { useSnackbar } from "notistack";
import ImageInput from "../ProductsImage/ProductsImage";
import "./ProductsCreateStyles.css";

const ProductsCreate = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [product, setProduct] = useState({
    id: "",
    category: "",
    name: "",
    options: "",
    price: 0,
    cost: 0,
    amountInStock: 0,
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    if (name === "category" && value === "Non-Foods/Disposables/Smallwares") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        options: "None",
      }));
    }
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

  const formValidations = () => {
    const newErrors = {};
    const price = parseFloat(product.price);
    const cost = parseFloat(product.cost);
    const amountInStock = parseFloat(product.amountInStock);

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
    if (
      product.category !== "Non-Foods/Disposables/Smallwares" &&
      !isRequired(product.options)
    ) {
      newErrors.options = "Options are required";
    }
    if (!isPositiveNumber(price)) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!isPositiveNumber(cost)) {
      newErrors.cost = "Cost must be greater than 0";
    }
    if (!isPositiveNumber(amountInStock)) {
      newErrors.amountInStock = "Amount in Stock must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValidations()) return;

    const newProductRef = push(ref(database, "merchant/products"));
    const productGenerateId = {
      ...product,
      id: newProductRef.key,
      price: parseFloat(product.price),
      cost: parseFloat(product.cost),
      amountInStock: parseFloat(product.amountInStock),
    };

    set(newProductRef, productGenerateId)
      .then(() => {
        enqueueSnackbar("Product Saved successfully!", {
          variant: "success",
        });
        navigate("/products");
        setProduct({
          category: "",
          name: "",
          options: "",
          price: "",
          cost: "",
          amountInStock: "",
          imageUrl: "",
        });
        navigate("/products");
      })
      .catch((error) => {
        enqueueSnackbar("Error deleting product: " + error.message, {
          variant: "error",
        });
      });
  };

  const handleCancel = () => {
    navigate("/products");
  };

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
      <Card className="card-container">
        <CardHeader
          title={<span className="bold-title">Product Details</span>}
        />
        <Divider fullWidth />
        <form onSubmit={handleSubmit} className="form-container">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Tooltip
                title="Input Product Name doesn't accept special characters and has a limit of 255 Characters"
                placement="top-start"
                arrow
              >
                <TextField
                  fullWidth
                  margin="normal"
                  type="text"
                  name="name"
                  label="Name"
                  value={product.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  FormHelperTextProps={{ error: !!errors.name }}
                  inputProps={{ maxLength: 255 }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip
                title="Select category for product, selecting Non-Foods/Disposables/Smallwares will disable Size selection."
                placement="top-start"
                arrow
              >
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.category}
                >
                  <InputLabel id="category-label">Category*</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    label="Category"
                    value={product.category}
                    onChange={handleSelectChange}
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
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Size for product" placement="top-start" arrow>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.options}
                  disabled={
                    product.category === "Non-Foods/Disposables/Smallwares"
                  }
                >
                  <InputLabel id="size-label">Size*</InputLabel>
                  <Select
                    labelId="size-label"
                    id="options"
                    name="options"
                    label="Size"
                    value={product.options}
                    onChange={handleSelectChange}
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
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                type="number"
                name="price"
                label="Price"
                value={product.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                }}
                onChange={handleChange}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                }}
                value={product.cost}
                onChange={handleChange}
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
                error={!!errors.amountInStock}
                helperText={errors.amountInStock}
                FormHelperTextProps={{ error: !!errors.amountInStock }}
              />
            </Grid>
          </Grid>
        </form>
      </Card>
      <ImageInput onImageChange={handleImageChange} />
      <SaveButtonBar
        onSave={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />
    </>
  );
};

export default ProductsCreate;
