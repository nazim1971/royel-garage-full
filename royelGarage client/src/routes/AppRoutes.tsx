import { Route, Routes } from "react-router";
import App from "../App";
import About from "../pages/Public/About";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AllProducts from "../pages/Public/AllProducts";
import ProductDetails from "../pages/Public/ProductDetails";
import { generateRoutes } from "../utils/routeGenerator";
import { adminPaths } from "./admin/AdminPaths";
import { customerPaths } from "./customer/CustomerPaths";
import Home from "../pages/Public/Home";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import NotFound from "../pages/Public/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="all-products" element={<AllProducts />} />
        <Route path="product-details/:id" element={<ProductDetails />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        {generateRoutes(adminPaths)}
      </Route>
      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        {generateRoutes(customerPaths)}
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Error Route */}
      <Route path="not-found" element={<NotFound />} />

      {/* Catch-all route for unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
