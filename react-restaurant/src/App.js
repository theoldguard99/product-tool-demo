import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Products from './components/Products/Products';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProductsCreate from './components/Products/components/ProductsCreate/ProductsCreate';
import ProductsDetail from './components/Products/components/ProductsDetail/ProductsDetail';
import ProductsList from './components/Products/components/ProductsList/ProductsList';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/create" element={<ProductsCreate />} />
                  <Route path="/products/list" element={<ProductsList />} />
                  <Route path="/products/details/:id" element={<ProductsDetail />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
