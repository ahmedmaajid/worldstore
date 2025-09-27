import React from "react";
import { Store, Heart, Home, User, Handbag } from "lucide-react";

export default function MobileFooterNav() {
  return (
    <nav className="mobile-footer-nav">
      <a href="/" className="nav-item">
        <Home />
        <span>Home</span>
      </a>
      <a href="/shop" className="nav-item">
        <Store />
        <span>Shop</span>
      </a>
      <a href="/wishlist" className="nav-item">
        <Heart />
        <span>Wishlist</span>
      </a>
      {/* <a href="/" className="nav-item">
        <img src="./WhatsApp.png" alt="" />
        <span>Contact</span>
      </a> */}
      <a href="/account/login" className="nav-item">
        <User />
        <span>Account</span>
      </a>
    </nav>
  );
}
