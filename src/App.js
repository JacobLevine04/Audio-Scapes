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
import FileList from "./components/FileList"; // Import the FileList component
import { UserProvider } from './UserContext';

function App() {
  const [files, setFiles] = useState([]);

  const updateFileList = (newFile) => {
    setFiles(prevFiles => [...prevFiles, newFile]);
  };

  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          {/* Pass updateFileList as a prop to the Upload component */}
          <Route path="/upload" exact element={<Upload updateFileList={updateFileList} />}></Route>
          <Route path="/create" exact element={<Create />}></Route>
          <Route path="/login" exact element={<Login />}></Route>
          <Route path="/user" exact element={<User />}></Route>
          <Route path="/addfriend" exact element={<AddFriend />}></Route>
          <Route path="/social" exact element={<Social />}></Route>
          {/* Adding a route for FileList if needed */}
          <Route path="/files" exact element={<FileList files={files} />}></Route>
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
