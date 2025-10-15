import React, { useEffect, useState } from "react";
import { getRandomSubCategories } from "../../api/products";
import { Link } from "react-router-dom";

const RandomSubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    async function getSubData() {
      const subCats = await getRandomSubCategories();
      setSubCategories(subCats.data || []);
      console.log("Sub Cats", subCats.data);
    }
    getSubData();
  }, []);

  return (
    <div className="random-subcategories">
      <style>{`
        .random-subcategories {
          background-color: #fff;
          padding: 2rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          box-sizing: border-box;
          margin-top:6rem
        }

        .subcat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.3s ease;
          text-decoration: none;
        }

        .subcat-card:hover .subcat-image {
          box-shadow: 0px 0px 4px #eee;
        }

        .subcat-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          background-color: #f7f7f7;
          margin-bottom: 0.8rem;
        }

        .subcat-name {
          font-size: 0.95rem;
          font-weight: 500;
          color: #333;
          letter-spacing: 0.3px;
        }

        @media (max-width: 768px) {
          .random-subcategories {
            padding: 1.5rem;
            gap: 1.5rem;
          }

          .subcat-image {
            width: 80px;
            height: 80px;
          }

          .subcat-name {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .subcat-image {
            width: 70px;
            height: 70px;
          }

          .subcat-name {
            font-size: 0.85rem;
          }
        }
      `}</style>

      {subCategories.map((subCat) => (
        <Link 
          to={`/shop/category/${subCat.fullSlugPath}`} 
          key={subCat._id} 
          className="subcat-card"
        >
          <img src={subCat.image} alt={subCat.displayName} className="subcat-image" />
          <div className="subcat-name">{subCat.displayName}</div>
        </Link>
      ))}
    </div>
  );
};

export default RandomSubCategories;