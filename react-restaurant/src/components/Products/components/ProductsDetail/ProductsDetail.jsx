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
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ProductImage from "../ProductsImage/ProductsImage";
import SaveButtonBar from "../../../SaveButtonBar/SaveButtonBar";

const ProductsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
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
      <Card className="card-container">
        <CardHeader
          title={<span className="bold-title">Product Details</span>}
        />
        <Divider />
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" disabled={!isEditing}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {productCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
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
