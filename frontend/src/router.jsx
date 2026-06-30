import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import ProductList from "./pages/products/ProductList.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";

import CategoryList from "./pages/categories/CategoryList.jsx";
import OrderList from "./pages/orders/OrderList.jsx";
import UserProfile from "./pages/profile/UserProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/products" />,
      },
      {
        path: "/products",
        element: <ProductList />,
      },
      {
        path: "/categories",
        element: <CategoryList />,
      },
      {
        path: "/orders",
        element: <OrderList />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      }
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
