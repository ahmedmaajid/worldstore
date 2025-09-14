import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">World Store</div>

        <nav className="footer__links">
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </nav>

        <p className="footer__copy">
          © {new Date().getFullYear()} World Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
