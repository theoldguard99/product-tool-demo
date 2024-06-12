import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Products from './components/Products/Products';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProductsCreate from './components/Products/components/ProductsCreate/ProductsCreate';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    console.log('Checking localStorage isLoggedIn:', loggedInStatus);
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
      console.log('User is logged in');
    } else {
      setIsLoggedIn(false);
      console.log('User is not logged in');
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    console.log('User logged in and localStorage set');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    console.log('User logged out and localStorage cleared');
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
