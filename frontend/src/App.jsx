// import React, { useEffect } from 'react'
// import Home from "./pages/Home"
// import Navbar from './components/Navbar/Navbar'
// import Footer from './components/Footer/Footer'
// import './App.css';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import AllBooks from './pages/AllBooks';
// import Login from './pages/Login';
// import SignUp from './pages/SignUp';
// import Cart from './pages/Cart';
// import Profile from './pages/Profile';
// import AboutUs from './pages/AboutUs';
// import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
// import ScrollToTop from './components/ScrollTop/ScrollTop';
// import { useDispatch, useSelector } from "react-redux";
// import { authActions } from "./store/auth"
// import Favourites from './components/Profile/Favourites';
// import UserOrderHistory from './components/Profile/UserOrderHistory';
// import Settings from './components/Profile/Settings';
// import Admin from "./components/Navbar/AdminNavbar"
// import AdminProfile from './components/Admin/AdminProfile';
// import AddBook from './components/Admin/AddBook';
// import AdminUsers from './components/Admin/AdminUsers';
// import BecomeSeller from './components/Profile/BecomeSeller';
// import SellerForm from './components/Seller/SellerForm';
// import BankDetailsForm from './components/Seller/BankDetailsForm';
// import SellerAddressForm from './components/Seller/SellerAddressForm';
// import SellerPreview from './components/Seller/SellerPreview';
// import VerifiedSeller from './components/Profile/VerifiedSeller';
// import SellerAccountInfo from './components/SellerProfile/SellerAccountInfo';
// import SellerAddBook from './components/Seller/SellerAddBook';
// import MyProducts from './components/Seller/MyProducts';

// import SellerSidebar from './components/SellerProfile/SellerSidebar';
// import SellerProfile1 from './pages/SellerProfile';
// import SellerBankInfo from './components/SellerProfile/SellerBankInfo';
// import SellerViewBookDetails from './components/ViewBookDetails/SellerViewBookDetails';
// import SellerApplicationSubmitted from './components/Profile/SellerApplicationSubmitted';
// import AdminSellers from './components/Admin/Seller/AdminSeller';
// import SubmittedPop from './components/Profile/SubmittedPop';
// import OrderDetailsPage from './components/Profile/OrderDetailsPage';

// import CheckoutLayout from "./components/checkout/CheckoutLayout";
// import COD_Page from './components/checkout/COD_Page';

// import PremiumPage from './components/Premium/PremiumPage';

// import SellerOrdersDashboard from './components/SellerOrder/SellerOrdersDashboard';
// import EditBook from './components/Seller/EditBook';

// const App=()=> {
//   const dispatch=useDispatch();
//   const role= useSelector((state)=>state.auth.role);
//   useEffect(()=>{
//     if(
//       localStorage.getItem("id")&&
//       localStorage.getItem("token")&&
//       localStorage.getItem("role")
    
//     ){
//       dispatch(authActions.login());
//       dispatch(authActions.changeRole(localStorage.getItem("role")));
//     }
//   },[]);
//   return (
//     <div>
     
//         <ScrollToTop/>
//         {role === "admin" ? <Admin /> : <Navbar />}

//         <Routes>
//           <Route exact path="/" element={<Home/>}/>
//           <Route  path="/all-books" element={<AllBooks/>}/>
//           <Route  path="/cart" element={<Cart/>}/>
//           <Route  path="/about-us" element={<AboutUs/>}/>
          
//           {/* Profile Routes - Fixed nested routing */}
//           <Route  path="/profile" element={<Profile/>}>
//             <Route index element={<Favourites/>}/>
//             <Route path="orderHistory" element={<UserOrderHistory/>}/>
//             <Route path="orderHistory/order-details/:orderId" element={<OrderDetailsPage />} />
//             <Route path="become-seller" element={<BecomeSeller/>}/>
//             <Route path="settings" element={<Settings/>}/>
//             <Route path="verified-seller-info" element={<VerifiedSeller />} />
//             <Route path="seller-application-submitted" element={<SellerApplicationSubmitted />} />
//           </Route>

//  {/* REDIRECT LEGACY ROUTES TO NEW STRUCTURE WITH SIDEBAR */}
//           {/* <Route path="/seller/add-book" element={<Navigate to="/seller/add-book" replace />}/> */}
//           {/* <Route path="/seller/myproducts" element={<Navigate to="/seller/profile/my-products" replace />}/> */}

//           <Route path="/seller/myproducts" element={<MyProducts/>}/>
//           <Route path="/seller/add-book" element={<SellerAddBook/>}/>
          
//           {/* Seller Profile Routes - WITH SIDEBAR */}
//           <Route path="/seller/profile" element={<SellerProfile1 />}>
//             <Route index element={<SellerAccountInfo />} />
//             <Route path="bank-info" element={<SellerBankInfo />} />
//             <Route path="add-book" element={<SellerAddBook/>} />
//             <Route path="my-products" element={<MyProducts/>} />
//           </Route>

//           {/* Individual Seller Routes that don't need sidebar */}
//           <Route path="/seller/viewproduct/:id" element={<SellerViewBookDetails/>}/>
          
         
          
//           <Route  path="/signin" element={<Login/>}/>
//           <Route  path="/Signup" element={<SignUp/>}/>
//           <Route  path="/view-book-details/:id" element={<ViewBookDetails/>}/>
         
//           {/* Admin Routes */}
//           <Route path="/Admin/profile" element={<AdminProfile />} />
//           <Route path="/Admin/AddBook" element={<AddBook />} />
//           <Route path="/Admin/Users-List" element={<AdminUsers/>} />
//           <Route path="/Admin/Sellers-List" element={<AdminSellers/>} />

//           {/* Seller Form Routes */}
//           <Route path="/seller/form" element={<SellerForm />} />
//           <Route path="/seller/bank-details" element={<BankDetailsForm />} />
//           <Route path="/seller/pickup-address" element={<SellerAddressForm />} />
//           <Route path="/seller/form-preview" element={<SellerPreview />} />
//           <Route path="/profile/Submitted" element={<SubmittedPop />} />
//           <Route path="/seller/edit-product/:id" element={<EditBook />} />

//           {/* Checkout Routes */}
//           <Route path="/checkout/:id" element={<CheckoutLayout />} />
//           <Route path="/cod-confirmation" element={<COD_Page />} />
           
//            //PremiumPage
//           <Route path="/premium" element={<PremiumPage />} />

//            //SellerOrdersDashboard
//           <Route path="/seller/orders" element={<SellerOrdersDashboard />} />



//         </Routes>
//         <Footer/>
      
//     </div>
//   )
// }

// export default App


import React, { useEffect } from 'react'
import Home from "./pages/Home"
import ForgotPassword from './pages/ForgotPassword';
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
import MySubscriptions from './components/Profile/MySubscriptions';
import Settings from './components/Profile/Settings';
import Admin from "./components/Navbar/AdminNavbar"
import AdminProfile from './components/Admin/AdminProfile';
import AddBook from './components/Admin/AdminAddBook';
import AdminUsers from './components/Admin/AdminUsers';
import ServicesComingSoon from './components/Service/ServicesComingSoon';


// footer
import PrivacyPolicy from './components/Footer/PrivacyPolicy';
import TermsOfService from './components/Footer/TermsOfService';
import RefundPolicy from './components/Footer/RefundPolicy';
import Support from './components/Footer/Support';




import BecomeSeller from './components/Profile/BecomeSeller';
import SellerForm from './components/Seller/SellerForm';
import BankDetailsForm from './components/Seller/BankDetailsForm';
import SellerAddressForm from './components/Seller/SellerAddressForm';
import SellerPreview from './components/Seller/SellerPreview';
import VerifiedSeller from './components/Profile/VerifiedSeller';
import SellerAccountInfo from './components/SellerProfile/SellerAccountInfo';
import SellerAddBook from './components/SellerNavbar/SellerAddBook';
import MyProducts from './components/SellerNavbar/MyProducts';
import SellerDashboard from './components/SellerNavbar/SellerDashboard';
import SellerWallet from './components/SellerNavbar/SellerWallet'

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
import EditBook from './components/Seller/EditBook';
import SellerProduct from './components/Admin/Seller/SellerProduct';


// ✅ RBAC: Seller Route Guard — blocks Buyer-only users from seller pages
const SellerRouteGuard = ({ children }) => {
  const [checking, setChecking] = React.useState(true);
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if (!token || !id) {
      setChecking(false);
      setAllowed(false);
      return;
    }
    const API = `${import.meta.env.VITE_API_URL}/api/v1`;
    import('axios').then(({ default: ax }) => {
      ax.get(`${API}/get-user-information`, {
        headers: { authorization: `Bearer ${token}`, id }
      }).then(res => {
        const u = res.data?.data || res.data;
        const isSeller = u?.isSeller === true || u?.isSeller === 'true';
        const isApproved = u?.sellerApplicationStatus === 'Accepted';
        setAllowed(isSeller && isApproved);
      }).catch(() => setAllowed(false))
        .finally(() => setChecking(false));
    });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800/60 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-gray-400 text-sm mb-1">You don't have Seller access.</p>
          <p className="text-gray-500 text-xs mb-6">Only approved Sellers can access this area. Please apply to become a Seller first.</p>
          <div className="flex flex-col gap-2">
            <a href="/" className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-xl font-semibold text-sm hover:from-yellow-300 hover:to-orange-300 transition-all duration-300">
              Go to Home
            </a>
            <a href="/profile/become-seller" className="w-full py-2.5 border border-yellow-400/40 text-yellow-400 rounded-xl font-medium text-sm hover:bg-yellow-400/10 transition-all duration-300">
              Apply as Seller
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};



const App=()=> {
  const dispatch=useDispatch();
  const role= useSelector((state)=>state.auth.role);
  
  useEffect(()=>{
    // ✅ CRITICAL FIX: Check localStorage and update Redux on mount
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("id");
    const storedToken = localStorage.getItem("token");
    
    console.log("🔍 App mounted - checking localStorage...");
    console.log("Stored role:", storedRole);
    console.log("Stored ID:", storedId);
    console.log("Has token:", !!storedToken);
    console.log("Current Redux role:", role);
    
    if(storedId && storedToken && storedRole){
      console.log("✅ Restoring session from localStorage");
      // Dispatch in correct order: login first, then role
      dispatch(authActions.login());
      // Use setTimeout to ensure state update completes
      setTimeout(() => {
        dispatch(authActions.changeRole(storedRole));
        console.log("✅ Redux state updated with role:", storedRole);
      }, 0);
    } else {
      console.log("❌ No valid session found in localStorage");
    }
  },[dispatch]); // ✅ Only run on mount, removed 'role' from dependencies
  
  // ✅ Log whenever role changes
  useEffect(() => {
    console.log("🔄 Role changed in Redux:", role);
  }, [role]);

  console.log("🎨 Rendering App with role:", role);
  console.log("📊 Will show:", role === "admin" ? "Admin Navbar" : "User Navbar");

  return (
    <div>
      <ScrollToTop/>
      {role === "admin" ? <Admin /> : <Navbar />}

      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route  path="/all-books" element={<AllBooks/>}/>
        <Route  path="/cart" element={<Cart/>}/>
        <Route  path="/about-us" element={<AboutUs/>}/>
        <Route  path="/services" element={<ServicesComingSoon/>}/>
        
        {/* Profile Routes - Fixed nested routing */}
        <Route  path="/profile" element={<Profile/>}>
          <Route index element={<Favourites/>}/>
          <Route path="orderHistory" element={<UserOrderHistory/>}/>
          <Route path="orderHistory/order-details/:orderId" element={<OrderDetailsPage />} />
          <Route path="become-seller" element={<BecomeSeller/>}/>
           <Route path="my-subscriptions" element={<MySubscriptions/>}/>
          <Route path="settings" element={<Settings/>}/>
          <Route path="verified-seller-info" element={<VerifiedSeller />} />
          <Route path="seller-application-submitted" element={<SellerApplicationSubmitted />} />
        </Route>


//footer
{/* footer */}
<Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
<Route path="/terms-of-service" element={<TermsOfService/>}/>
<Route path="/refund-policy" element={<RefundPolicy/>}/>
<Route path="/support" element={<Support/>}/>



        {/* Seller Routes — RBAC Protected */}
        <Route path="/seller/myproducts" element={<SellerRouteGuard><MyProducts/></SellerRouteGuard>}/>
        <Route path="/seller/add-product" element={<SellerRouteGuard><SellerAddBook/></SellerRouteGuard>}/>
        <Route path="/seller/dashboard" element={<SellerRouteGuard><SellerDashboard/></SellerRouteGuard>}/>
        <Route path="/seller/mywallet" element={<SellerRouteGuard><SellerWallet/></SellerRouteGuard>}/>
        
        {/* Seller Profile Routes - WITH SIDEBAR — RBAC Protected */}
        <Route path="/seller/profile" element={<SellerRouteGuard><SellerProfile1 /></SellerRouteGuard>}>
          <Route index element={<SellerAccountInfo />} />
          <Route path="bank-info" element={<SellerBankInfo />} />
          <Route path="add-book" element={<SellerAddBook/>} />
          <Route path="my-products" element={<MyProducts/>} />
        </Route>

        {/* Individual Seller Routes that don't need sidebar — RBAC Protected */}
        <Route path="/seller/viewproduct/:id" element={<SellerRouteGuard><SellerViewBookDetails/></SellerRouteGuard>}/>
        
        <Route  path="/signin" element={<Login/>}/>
        <Route  path="/Signup" element={<SignUp/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route  path="/view-book-details/:id" element={<ViewBookDetails/>}/>
       
        {/* Admin Routes */}
        <Route path="/Admin/profile" element={<AdminProfile />} />
        <Route path="/Admin/AddBook" element={<AddBook />} />
        <Route path="/Admin/Users-List" element={<AdminUsers/>} />
        <Route path="/Admin/Sellers-List" element={<AdminSellers/>} />
        <Route path="/Admin/Seller-Products" element={<SellerProduct/>} />

        <Route path="/Admin/books" element={<AllBooks/>} />

        {/* Seller Form Routes */}
        <Route path="/seller/form" element={<SellerForm />} />
        <Route path="/seller/bank-details" element={<BankDetailsForm />} />
        <Route path="/seller/pickup-address" element={<SellerAddressForm />} />
        <Route path="/seller/form-preview" element={<SellerPreview />} />
        <Route path="/profile/Submitted" element={<SubmittedPop />} />
        <Route path="/seller/edit-product/:id" element={<SellerRouteGuard><EditBook /></SellerRouteGuard>} />

        {/* Checkout Routes */}
        <Route path="/checkout/:id" element={<CheckoutLayout />} />
        <Route path="/cod-confirmation" element={<COD_Page />} />
         
        {/* PremiumPage */}
        <Route path="/premium" element={<PremiumPage />} />

        {/* SellerOrdersDashboard — RBAC Protected */}
        <Route path="/seller/orders" element={<SellerRouteGuard><SellerOrdersDashboard /></SellerRouteGuard>} />

      </Routes>
      <Footer/>
    </div>
  )
}

export default App