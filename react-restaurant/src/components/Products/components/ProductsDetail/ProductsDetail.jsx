import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../../../../firebaseConfig";
import { ref, get, update, remove } from "firebase/database";

const ProductsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const productRef = ref(database, `merchant/products/${id}`);
    get(productRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setProduct(snapshot.val());
        } else {
          console.error("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const productRef = ref(database, `merchant/products/${id}`);
    update(productRef, product)
      .then(() => {
        alert("Product updated successfully!");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete this product?")) {
      const productRef = ref(database, `merchant/products/${id}`);
      remove(productRef)
        .then(() => {
          alert("Product deleted successfully!");
          navigate("/products");
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Product Details</h2>
      <div>
        <strong>Category:</strong>
        {isEditing ? (
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
          />
        ) : (
          <span> {product.category}</span>
        )}
      </div>
      <div>
        <strong>Name:</strong>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        ) : (
          <span> {product.name}</span>
        )}
      </div>
      <div>
        <strong>Options:</strong>
        {isEditing ? (
          <input
            type="text"
            name="options"
            value={product.options}
            onChange={handleChange}
          />
        ) : (
          <span> {product.options}</span>
        )}
      </div>
      <div>
        <strong>Price:</strong>
        {isEditing ? (
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        ) : (
          <span> {product.price}</span>
        )}
      </div>
      <div>
        <strong>Cost:</strong>
        {isEditing ? (
          <input
            type="number"
            name="cost"
            value={product.cost}
            onChange={handleChange}
          />
        ) : (
          <span> {product.cost}</span>
        )}
      </div>
      <div>
        <strong>Amount in Stock:</strong>
        {isEditing ? (
          <input
            type="number"
            name="amountInStock"
            value={product.amountInStock}
            onChange={handleChange}
          />
        ) : (
          <span> {product.amountInStock}</span>
        )}
      </div>
      {product.imageUrl && (
        <div>
          <strong>Image:</strong>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
      {isEditing ? (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
        Delete
      </button>
    </div>
  );
};

export default ProductsDetail;
