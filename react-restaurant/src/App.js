import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import Sidebar from './components/Sidebar/Sidebar';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </Layout>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </Router>
  );
};

export default App;
