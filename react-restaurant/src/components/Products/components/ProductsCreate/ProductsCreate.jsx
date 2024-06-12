import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../../../firebaseConfig";
import { ref, set, push } from "firebase/database";

console.log("Database instance:", database);

const ProductsCreate = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id: "",
    category: "",
    name: "",
    options: "",
    price: 0,
    cost: 0,
    amountInStock: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProductRef = push(ref(database, "merchant/products"));
    set(newProductRef, product)
      .then(() => {
        alert("Saved Successfully!");
        setProduct({
          id: "",
          category: "",
          name: "",
          options: "",
          price: 0,
          cost: 0,
          amountInStock: 0,
        });
        navigate("/products");
      })
      .catch((error) => {
        console.error("Error creating product: ", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        placeholder="ID"
        value={product.id}
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={product.category}
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={product.name}
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="text"
        name="options"
        placeholder="Options"
        value={product.options}
        onChange={handleChange}
      />
      <br />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="number"
        name="cost"
        placeholder="Cost"
        value={product.cost}
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="number"
        name="amountInStock"
        placeholder="Amount in Stock"
        value={product.amountInStock}
        onChange={handleChange}
        required
      />
      <br />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductsCreate;
