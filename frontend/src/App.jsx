import React, { useEffect } from 'react'
import Home from "./pages/Home"
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AllBooks from './pages/AllBooks';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import ScrollToTop from './components/ScrollTop/ScrollTop';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/auth"
import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';
import Admin from "./components/Navbar/AdminNavbar"
import AdminProfile from './components/Admin/AdminProfile';
import AddBook from './components/Admin/AddBook';
import AdminUsers from './components/Admin/AdminUsers';
import BecomeSeller from './components/Profile/BecomeSeller';
import SellerForm from './components/Seller/SellerForm';
import BankDetailsForm from './components/Seller/BankDetailsForm';
import SellerAddressForm from './components/Seller/SellerAddressForm';
import SellerPreview from './components/Seller/SellerPreview';
import VerifiedSeller from './components/Profile/VerifiedSeller';
import SellerAccountInfo from './components/SellerProfile/SellerAccountInfo';

import SellerSidebar from './components/SellerProfile/SellerSidebar';
import SellerProfile1 from './pages/SellerProfile';
import SellerBankInfo from './components/SellerProfile/SellerBankInfo';
const App=()=> {
  const dispatch=useDispatch();
  const role= useSelector((state)=>state.auth.role);
  useEffect(()=>{
    if(
      localStorage.getItem("id")&&
      localStorage.getItem("token")&&
      localStorage.getItem("role")
    
    ){
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  },[]);
  return (
    <div>
     
        <ScrollToTop/>
        {role === "admin" ? <Admin /> : <Navbar />}

        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route  path="/all-books" element={<AllBooks/>}/>
          <Route  path="/cart" element={<Cart/>}/>
          <Route  path="/about-us" element={<AboutUs/>}/>
          <Route  path="/profile" element={<Profile/>}>
          <Route index element={<Favourites/>}/>
          <Route path="/profile/orderHistory" element={<UserOrderHistory/>}/>
           <Route path="/profile/become-seller" element={<BecomeSeller/>}/>
          <Route path="/profile/settings" element={<Settings/>}/>
           <Route path="/profile/verified-seller-info" element={<VerifiedSeller />} />
         </Route>

   <Route path="/seller/profile" element={<SellerProfile1 />}>
  <Route index element={<SellerAccountInfo />} />  // default child route
  <Route path="/seller/profile/bank-info" element={<SellerBankInfo />} />
</Route>



          
          <Route  path="/signin" element={<Login/>}/>
          <Route  path="/Signup" element={<SignUp/>}/>
          <Route  path="/view-book-details/:id" element={<ViewBookDetails/>}/>
         

        <Route path="/Admin/profile" element={<AdminProfile />} />
<Route path="/Admin/AddBook" element={<AddBook />} />
<Route path="/Admin/AdminUsers" element={<AdminUsers/>} />

<Route path="/seller/form" element={<SellerForm />} />
<Route path="/seller/bank-details" element={<BankDetailsForm />} />
<Route path="/seller/pickup-address" element={<SellerAddressForm />} />
<Route path="/seller/form-preview" element={<SellerPreview />} />



        </Routes>
        <Footer/>
      
      
      
    </div>
  )
}

export default App