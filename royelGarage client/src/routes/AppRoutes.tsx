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

const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<App />}>
        <Route path="" element={<Home/>} />
          <Route path="about" element={<About/>} />
          <Route path="all-products" element={<AllProducts/>} />
          <Route path="product-details" element={<ProductDetails/>} />
        </Route>
  
        <Route path="/admin" element={<App />}>
          {generateRoutes(adminPaths)}
        </Route>
        <Route path="/customer" element={<App />}>
          {generateRoutes(customerPaths)}
        </Route>
  
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    );
  };
  
  export default AppRoutes;