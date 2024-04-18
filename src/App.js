import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { UserProvider } from './authmanager';
import Home from "./components/pages/Home";
import Upload from "./components/pages/Upload";
import Create from "./components/pages/Create";
import Login from "./components/pages/Login";
import User from "./components/pages/User";
import Social from "./components/pages/Social";
import AddFriend from "./components/pages/AddFriend";
import Footer from "./components/Footer";

import { UserProvider } from './UserContext';

// import results from "./components/results";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home></Home>}></Route>
          <Route path="/upload" exact element={<Upload></Upload>}></Route>
          <Route path="/create" exact element={<Create></Create>}></Route>
          <Route path="/login" exact element={<Login></Login>}></Route>
          <Route path="/user" exact element={<User></User>}></Route>
          <Route path="/addfriend" exact element={<AddFriend></AddFriend>}></Route>
          <Route path="/social" exact element={<Social></Social>}></Route>
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
