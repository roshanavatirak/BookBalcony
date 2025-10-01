import React, { useEffect } from 'react'
import Home from "./pages/Home"
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import SellerAddBook from './components/Seller/SellerAddBook';
import MyProducts from './components/Seller/MyProducts';

import SellerSidebar from './components/SellerProfile/SellerSidebar';
import SellerProfile1 from './pages/SellerProfile';
import SellerBankInfo from './components/SellerProfile/SellerBankInfo';
import SellerViewBookDetails from './components/ViewBookDetails/SellerViewBookDetails';
import SellerApplicationSubmitted from './components/Profile/SellerApplicationSubmitted';
import AdminSellers from './components/Admin/Seller/AdminSeller';
import SubmittedPop from './components/Profile/SubmittedPop';
import OrderDetailsPage from './components/Profile/OrderDetailsPage';

import CheckoutLayout from "./components/checkout/CheckoutLayout";
import COD_Page from './components/checkout/COD_Page';

import PremiumPage from './components/Premium/PremiumPage';

import SellerOrdersDashboard from './components/SellerOrder/SellerOrdersDashboard';

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
          
          {/* Profile Routes - Fixed nested routing */}
          <Route  path="/profile" element={<Profile/>}>
            <Route index element={<Favourites/>}/>
            <Route path="orderHistory" element={<UserOrderHistory/>}/>
            <Route path="orderHistory/order-details/:orderId" element={<OrderDetailsPage />} />
            <Route path="become-seller" element={<BecomeSeller/>}/>
            <Route path="settings" element={<Settings/>}/>
            <Route path="verified-seller-info" element={<VerifiedSeller />} />
            <Route path="seller-application-submitted" element={<SellerApplicationSubmitted />} />
          </Route>

 {/* REDIRECT LEGACY ROUTES TO NEW STRUCTURE WITH SIDEBAR */}
          <Route path="/seller/add-book" element={<Navigate to="/seller/profile/add-book" replace />}/>
          <Route path="/seller/myproducts" element={<Navigate to="/seller/profile/my-products" replace />}/>
          
          {/* Seller Profile Routes - WITH SIDEBAR */}
          <Route path="/seller/profile" element={<SellerProfile1 />}>
            <Route index element={<SellerAccountInfo />} />
            <Route path="bank-info" element={<SellerBankInfo />} />
            <Route path="add-book" element={<SellerAddBook/>} />
            <Route path="my-products" element={<MyProducts/>} />
          </Route>

          {/* Individual Seller Routes that don't need sidebar */}
          <Route path="/seller/viewproduct/:id" element={<SellerViewBookDetails/>}/>
          
         
          
          <Route  path="/signin" element={<Login/>}/>
          <Route  path="/Signup" element={<SignUp/>}/>
          <Route  path="/view-book-details/:id" element={<ViewBookDetails/>}/>
         
          {/* Admin Routes */}
          <Route path="/Admin/profile" element={<AdminProfile />} />
          <Route path="/Admin/AddBook" element={<AddBook />} />
          <Route path="/Admin/Users-List" element={<AdminUsers/>} />
          <Route path="/Admin/Sellers-List" element={<AdminSellers/>} />

          {/* Seller Form Routes */}
          <Route path="/seller/form" element={<SellerForm />} />
          <Route path="/seller/bank-details" element={<BankDetailsForm />} />
          <Route path="/seller/pickup-address" element={<SellerAddressForm />} />
          <Route path="/seller/form-preview" element={<SellerPreview />} />
          <Route path="/profile/Submitted" element={<SubmittedPop />} />

          {/* Checkout Routes */}
          <Route path="/checkout/:id" element={<CheckoutLayout />} />
          <Route path="/cod-confirmation" element={<COD_Page />} />
           
           //PremiumPage
          <Route path="/premium" element={<PremiumPage />} />

           //SellerOrdersDashboard
          <Route path="/seller/orders" element={<SellerOrdersDashboard />} />



        </Routes>
        <Footer/>
      
    </div>
  )
}

export default App