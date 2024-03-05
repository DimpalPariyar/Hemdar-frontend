import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./UI/AppLayout";
import Home from "./pages/home/Home";
import Login from "./pages/account/Login";
import CreateAccount from "./pages/account/CreateAccount";
import Products from "./pages/products/Products";
import SingleProduct from "./pages/products/SingleProduct";
import Profile from "./pages/account/Profile";
import Checkout from "./pages/checkout/Checkout";
import Cart from "./pages/cart/Cart";
import Wishlist from "./pages/wishlist/Wishlist";
import AddProducts from "./pages/admin/AddProducts";
import UserList from "./pages/admin/UserList";
import ShippingPolicy from "./pages/staticPages/ShippingPolicy";
import ContactUs from "./pages/staticPages/ContactUs";
import AboutUs from "./pages/staticPages/AboutUs";
import TermsAndConditions from "./pages/staticPages/TermsAndConditions";
import UpdateProduct from "./pages/admin/UpdateProduct";
import ProductsList from "./pages/admin/ProductsList";
import AdminPage from "./pages/admin/AdminPage";
import PaymentSuccessfull from "./pages/payment/PaymentSuccessfull";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <CreateAccount /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:_id/:title", element: <SingleProduct /> },
      { path: "/account", element: <Profile /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/Cart", element: <Cart /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/addProducts", element: <AddProducts /> },
      { path: "/updateProducts/:_id", element: <UpdateProduct /> },
      { path: "/productsList", element: <ProductsList /> },
      { path: "/userlist", element: <UserList /> },
      { path: "/shippingpolicy", element: <ShippingPolicy /> },
      { path: "/contactus", element: <ContactUs /> },
      { path: "/Aboutus", element: <AboutUs /> },
      { path: "/termsandconditions", element: <TermsAndConditions /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/payment-successful", element: <PaymentSuccessfull /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

/*eslint-disable no-unused-vars*/
