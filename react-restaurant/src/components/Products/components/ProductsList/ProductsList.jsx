import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Card,
  TableSortLabel,
} from "@mui/material";
import "./ProductsList.css";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return order === "desc" ? -1 : 1;
    }
    if (b[orderBy] > a[orderBy]) {
      return order === "desc" ? 1 : -1;
    }
    return 0;
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => sortComparator(a, b, orderBy));

  return (
    <div>
      <Card className="card-container">
        <Box mb={2} sx={{ padding: 2 }}>
          <TextField
            fullWidth
            label="Search Product Name"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ maxWidth: "100%" }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                    hideSortIcon={false}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Size</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? order : "asc"}
                    onClick={() => handleRequestSort("price")}
                    hideSortIcon={false}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "cost"}
                    direction={orderBy === "cost" ? order : "asc"}
                    onClick={() => handleRequestSort("cost")}
                    hideSortIcon={false}
                  >
                    Cost
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "amountInStock"}
                    direction={orderBy === "amountInStock" ? order : "asc"}
                    onClick={() => handleRequestSort("amountInStock")}
                    hideSortIcon={false}
                  >
                    Amount in Stock
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  onClick={() => handleRowClick(product.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.options}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.cost}</TableCell>
                  <TableCell>{product.amountInStock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default ProductsList;
