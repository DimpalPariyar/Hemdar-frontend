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

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <CreateAccount /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:id/:title", element: <SingleProduct /> },
      { path: "/account", element: <Profile /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/Cart", element: <Cart /> },
      { path: "/wishlist", element: <Wishlist /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

/*eslint-disable no-unused-vars*/
