import React from "react";
import { Link } from "react-router-dom";
import ProductsList from "./components/ProductsList/ProductsList";
import { Box, Button } from "@mui/material";

const Products = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h1>Products</h1>
        <Link to="/products/create">
          <Button variant="contained" color="primary">
            Create New Product
          </Button>
        </Link>
      </Box>
      <ProductsList />
    </Box>
  );
};

export default Products;
