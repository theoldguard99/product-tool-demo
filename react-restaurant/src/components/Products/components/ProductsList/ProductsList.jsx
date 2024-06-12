import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../../../firebaseConfig";
import { ref, onValue } from "firebase/database";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const productsRef = ref(database, "merchant/products");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProducts(productsArray);
      }
    });
  }, []);

  const handleRowClick = (id) => {
    navigate(`/products/details/${id}`);
  };

  return (
    <div>
      <h2>Products List</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Options</th>
            <th>Price</th>
            <th>Cost</th>
            <th>Amount in Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => handleRowClick(product.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{product.category}</td>
              <td>{product.name}</td>
              <td>{product.options}</td>
              <td>{product.price}</td>
              <td>{product.cost}</td>
              <td>{product.amountInStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
