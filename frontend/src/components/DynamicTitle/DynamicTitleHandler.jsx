import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES = [
  { path: '/', title: 'BookBalcony - Home', exact: true },
  { path: '/all-books', title: 'BookBalcony - All Books' },
  { path: '/cart', title: 'BookBalcony - My Cart' },
  { path: '/about-us', title: 'BookBalcony - About Us' },
  { path: '/services', title: 'BookBalcony - Services' },
  { path: '/premium', title: 'BookBalcony - Premium Membership' },
  
  // Account / Profile routes
  { path: '/account/profile/my-profile', title: 'BookBalcony - My Profile' },
  { path: '/account/profile/orderHistory', title: 'BookBalcony - Order History' },
  { path: '/account/profile/my-subscriptions', title: 'BookBalcony - My Subscriptions' },
  { path: '/account/profile/settings', title: 'BookBalcony - Account Settings' },
  { path: '/account/profile/become-seller', title: 'BookBalcony - Become a Seller' },
  { path: '/account/profile/verified-seller-info', title: 'BookBalcony - Seller Verification' },
  { path: '/account/profile/seller-application-submitted', title: 'BookBalcony - Application Submitted' },
  { path: '/account/profile', title: 'BookBalcony - My Favourites' },
  
  // Auth routes
  { path: '/account/login', title: 'BookBalcony - Sign In' },
  { path: '/account/signup', title: 'BookBalcony - Sign Up' },
  { path: '/login', title: 'BookBalcony - Sign In' },
  { path: '/signup', title: 'BookBalcony - Sign Up' },
  { path: '/signin', title: 'BookBalcony - Sign In' },
  { path: '/forgot-password', title: 'BookBalcony - Reset Password' },

  // Footer & Legal
  { path: '/privacy-policy', title: 'BookBalcony - Privacy Policy' },
  { path: '/terms-of-service', title: 'BookBalcony - Terms of Service' },
  { path: '/refund-policy', title: 'BookBalcony - Refund Policy' },
  { path: '/support', title: 'BookBalcony - Customer Support' },

  // Checkout
  { path: '/checkout', title: 'BookBalcony - Secure Checkout' },
  { path: '/cod-confirmation', title: 'BookBalcony - Order Confirmation' },

  // Seller Portal
  { path: '/seller/dashboard', title: 'BookBalcony - Seller Dashboard' },
  { path: '/seller/myproducts', title: 'BookBalcony - My Products' },
  { path: '/seller/add-product', title: 'BookBalcony - Add New Product' },
  { path: '/seller/mywallet', title: 'BookBalcony - Seller Wallet' },
  { path: '/seller/orders', title: 'BookBalcony - Seller Orders' },
  { path: '/seller/profile', title: 'BookBalcony - Seller Profile' },
  { path: '/seller/form', title: 'BookBalcony - Seller Registration' },
  { path: '/seller/bank-details', title: 'BookBalcony - Bank Details' },
  { path: '/seller/pickup-address', title: 'BookBalcony - Pickup Address' },
  { path: '/seller/form-preview', title: 'BookBalcony - Application Preview' },

  // Admin Portal
  { path: '/Admin/profile', title: 'BookBalcony - Admin Profile' },
  { path: '/Admin/AddBook', title: 'BookBalcony - Admin Add Book' },
  { path: '/Admin/Users-List', title: 'BookBalcony - Admin Users Management' },
  { path: '/Admin/Sellers-List', title: 'BookBalcony - Admin Sellers Management' },
  { path: '/Admin/Seller-Products', title: 'BookBalcony - Admin Products View' },
  { path: '/Admin/Seller-Orders', title: 'BookBalcony - Admin Orders View' },
  { path: '/Admin/Seller-Dashboard', title: 'BookBalcony - Admin Dashboard' },
  { path: '/Admin/books', title: 'BookBalcony - Admin Catalog' },
  { path: '/Admin', title: 'BookBalcony - Admin Portal' },
];

const DynamicTitleHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    // Check for exact path match first
    const exactMatch = ROUTE_TITLES.find(r => r.exact && r.path === currentPath);
    if (exactMatch) {
      document.title = exactMatch.title;
      return;
    }

    // Check for prefix/pattern match
    const prefixMatch = ROUTE_TITLES.find(r => !r.exact && currentPath.startsWith(r.path));
    if (prefixMatch) {
      document.title = prefixMatch.title;
      return;
    }

    // Fallback for View Book Details
    if (currentPath.includes('/view-book-details/')) {
      document.title = 'BookBalcony - Book Details';
      return;
    }

    // Default fallback
    document.title = 'BookBalcony - Online Bookstore & Marketplace';
  }, [location]);

  return null;
};

export default DynamicTitleHandler;
