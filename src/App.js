import React, { useState } from 'react';
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

function App() {
  const [files, setFiles] = useState([]);

  const updateFileList = (newFile) => {
    setFiles(prevFiles => [newFile, ...prevFiles]);
  };

  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          {/* Pass updateFileList and files as props to the Upload and User components */}
          <Route path="/upload" exact element={<Upload updateFileList={updateFileList} />} />
          <Route path="/create" exact element={<Create />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/user" exact element={<User files={files} />} /> {/* Pass files to User */}
          <Route path="/addfriend" exact element={<AddFriend />} />
          <Route path="/social" exact element={<Social />} />
          {/* No need for a separate route for FileList if it's just part of User and Upload */}
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
