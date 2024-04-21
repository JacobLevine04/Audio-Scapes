import React from 'react';
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Upload from "./components/pages/Upload";
import Create from "./components/pages/Create";
import Login from "./components/pages/Login";
import User from "./components/pages/User";
import Social from "./components/pages/Social";
import AddFriend from "./components/pages/AddFriend";
import Footer from "./components/Footer";
import { UserProvider } from './UserContext';
import { FileProvider } from './FileContext';

function App() {
  return (
    <UserProvider>
      <FileProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/upload" exact element={<Upload />} />
            <Route path="/create" exact element={<Create />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/user" exact element={<User />} />
            <Route path="/addfriend" exact element={<AddFriend />} />
            <Route path="/social" exact element={<Social />} />
          </Routes>
          <Footer />
        </Router>
      </FileProvider>
    </UserProvider>
  );
}

export default App;
