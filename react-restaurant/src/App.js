import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout'; 
import Products from './components/Products/Products';
import ProductsCreate from './components/Products/components/ProductsCreate/ProductsCreate';
import ProductsDetail from './components/Products/components/ProductsDetail/ProductsDetail';
import ProductsList from './components/Products/components/ProductsList/ProductsList';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/create" element={<ProductsCreate />} />
          <Route path="/products/list" element={<ProductsList />} />
          <Route path="/products/details/:id" element={<ProductsDetail />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
