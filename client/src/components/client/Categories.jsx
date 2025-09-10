import React from "react";
import { Link } from "react-router-dom";

export default function Categories({ openSidebar }) {
  return (
    <section className="explore-categories">
      <div className="section-heading">
        <h2>Explore a Selection of Excellence</h2>
        <p>Discover Categories designed around you.</p>
      </div>
      <div className="explore-categories-grid">
        <Link to="" className="explore-categories-card">
          <img src="./Tech Essentials.png" alt="Women's Fashion" />
          <span>Tech Essentials</span>
        </Link>
        <Link to="" className="explore-categories-card">
          <img src="./Beauty & Personal Care.png" alt="Men's Fashion" />
          <span>Beauty & Personal Care</span>
        </Link>

        <Link to="" className="explore-categories-card">
          <img src="Handbag.png" alt="Women's Fashion" />
          <span>Women's Handbags</span>
        </Link>
        <Link to="" className="explore-categories-card">
          <img src="Headset.png" alt="Headset" />
          <span>Headsets</span>
        </Link>
        <Link to="" className="explore-categories-card">
          <img src="./Toy.png" alt="Women's Fashion" />
          <span>Kid's Toys</span>
        </Link>
        <Link to="" className="explore-categories-card">
          <img src="./Jwelry.png" alt="Men's Fashion" />
          <span>Jwelries</span>
        </Link>

        <Link to="" className="explore-categories-card">
          <img src="./Watch.png" alt="Women's Fashion" />
          <span>Wrist Watches</span>
        </Link>
        <Link to="" className="explore-categories-card">
          <img src="./Belt.png" alt="Headset" />
          <span>Belts</span>
        </Link>
      </div>
      <button className="btn btn-discover" onClick={openSidebar}>
        See All Categories
      </button>
    </section>
  );
}
