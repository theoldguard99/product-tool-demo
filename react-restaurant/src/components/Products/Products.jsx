import React from "react";
import { Link } from "react-router-dom";
import ProductsList from "./components/ProductsList/ProductsList";

const Products = () => {
  return (
    <div>
      <h1>Products</h1>
      <Link to="/products/create">
        <button>Create product</button>
      </Link>
      <ProductsList />
    </div>
  );
};

export default Products;
