import React from "react";
import { Link } from "react-router-dom";
const Products = () => {
  return (
    <div>
      <h1>Products</h1>
      <Link to="/products/create">
        <button>Create product</button>
      </Link>
    </div>
  );
};

export default Products;
