import React from 'react'
import Home from "./pages/Home"
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllBooks from './pages/AllBooks';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';

const App=()=> {
  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route  path="/all-books" element={<AllBooks/>}/>
          <Route  path="/cart" element={<Cart/>}/>
          <Route  path="/about-us" element={<AboutUs/>}/>
          <Route  path="/profile" element={<Profile/>}/>
          <Route  path="/LogIn" element={<Login/>}/>
          <Route  path="/Signup" element={<SignUp/>}/>
        </Routes>
        <Footer/>
      </Router>
      
      
    </div>
  )
}

export default App