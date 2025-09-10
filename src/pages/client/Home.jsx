import React from "react";
import "../../styles/client/home.css";
import "../../styles/client/media.css";
import { Link } from "react-router-dom";
import { NewArrivals } from "../../components/client/NewArrivals";
import Categories from "../../components/client/Categories";
import { MiddleBanner } from "../../components/client/MiddleBanner";
import { StarsIcon } from "lucide-react";
import FAQ from "../../components/client/FAQ";
import Footer from "../../components/client/Footer";
import MobileFooterNav from "../../components/client/MobileFooterNav";
export default function Home({ openSidebar }) {
  return (
    <main>
      <div className="hero">
        <div className="overlay"></div>
        <img className="hero-logo" src="./World Store.jpg" alt="" />
        {/* <img src="./World_Store-removebg-preview.png" alt="" /> */}

        <div className="new">
          <h2>World Store</h2>
          <p>This is a dynamic e-commerce platform</p>
        </div>
        {/* <h2 className="customized">
          Shop good,{" "}
          <span className="highlight">
            <StarsIcon />
            high-quality
          </span>{" "}
          products{" "}
          <img src="./Watch.png" alt="user" className="inline-avatar" /> that
          last long, without ever
          <img src="./Handbag.png" alt="user" className="inline-avatar" />
          stretching your budget{" "}
        </h2> */}
        <a href="" className="contact-whatsapp">
          <img src="./WhatsAppLogo.png" alt="" />
        </a>
      </div>
      <NewArrivals />
      <Categories openSidebar={openSidebar} />
      <MiddleBanner />
      <FAQ />
      <Footer />
      <MobileFooterNav />
    </main>
  );
}
