import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./Components/Signup.jsx";
import Login from "./Components/Login.jsx";
import Donate from "./Components/Donate.jsx";
import Transactions from "./Components/Transaction.jsx";
import About from "./Components/About";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/signup">Signup</Link> | 
          <Link to="/login">Login</Link> | 
          <Link to="/donate">Donate</Link> | 
          <Link to="/transactions">Transactions</Link> | 
          <Link to="/about">About</Link>
        </nav>

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path='/About' element={<About />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
