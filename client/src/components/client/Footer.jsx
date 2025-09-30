import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">World Store</div>

        <nav className="footer__links">
          <a href="https://www.instagram.com/framewallio">
            Developed and Designed By Framewall
          </a>
        </nav>

        <p className="footer__copy">
          © {new Date().getFullYear()} World Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
