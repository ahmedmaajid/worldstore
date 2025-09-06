import { Routes, Route } from "react-router-dom";
import Home from "../pages/client/Home";
import Shop from "../pages/client/Shop";
import Product from "../pages/client/Product";

export default function ClientRoutes({ openSidebar }) {
  return (
    <Routes>
      <Route path="/" element={<Home openSidebar={openSidebar} />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/category/:category" element={<Shop />} />
      <Route path="/shop/category/:category/:subcategory" element={<Shop />} />
    </Routes>
  );
}
