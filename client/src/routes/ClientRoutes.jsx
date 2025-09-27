import { Routes, Route } from "react-router-dom";
import Home from "../pages/client/Home";
import Shop from "../pages/client/Shop";
import Product from "../pages/client/Product";
import ProductPreview from "../pages/client/ProductPreview";
import { Cart } from "../pages/client/Cart";
import Wishlist from "../pages/client/Wishlist";
import Login from "../pages/client/Account";
import SignUp from "../pages/client/SignUp";
import Preview from "../pages/client/Preview";
import MyOrders from "../pages/client/MyOrders";

import Nav from "../components/client/Navbar";
import Sidebar from "../components/client/Sidebar";
import MobileFooterNav from "../components/client/MobileFooterNav";
export default function ClientRoutes({
  openSidebar,
  sidebarOpen,
  closeSidebar,
}) {
  return (
    <>
      <Nav openSidebar={openSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <Routes>
        <Route path="/" element={<Home openSidebar={openSidebar} />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/category/*" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/signup" element={<SignUp />} />
        <Route path="/product/:slug" element={<Preview />} />
        <Route path="/my-orders" element={<MyOrders />} />
        {/* <Route
          path="/product/"
          element={
            <ProductPreview
              product={{
                name: "Luxury Leather Bag",
                brand: "Gucci",
                price: 299.99,
                image: "/Handbag.png",
                thumbnails: ["/Handbag.png", "/Watch.png", "/Handbag.jpg"],
                colors: ["Red", "White", "Blue"],
                sizes: ["S", "M", "L"],
                variants: [
                  { color: "Red", size: "Large" },
                  { color: "Red", size: "Medium" },
                  { color: "Black", size: "Large" },
                ],
                description:
                  "This luxurious leather bag is handcrafted with the finest materials. Elegant and timeless, perfect for any occasion.",
                details: [
                  "100% Genuine Leather",
                  "Dimensions: 25cm x 15cm x 10cm",
                  "Made in Italy",
                  "Limited Edition",
                ],
              }}
            />
          }
        /> */}
      </Routes>
      <MobileFooterNav />
    </>
  );
}
