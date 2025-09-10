import React from "react";

export const Spinner = () => {
  return (
    <div className="modern-loader-container">
      {/* Main spinner */}
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>

      {/* Loading text */}
      <div className="loading-text">Loading</div>

      <style jsx>{`
        body {
          overflow: hidden !important;
        }
        .modern-loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          font-family: "Inter", sans-serif;
          z-index: 9999;
        }

        .spinner {
          width: 50px !important;
          height: 50px !important;
          margin-bottom: 20px;
        }

        .spinner-circle {
          width: 100%;
          height: 100%;
          border: 3px solid #e0e0e0;
          border-top: 3px solid #000000;
          border-radius: 50%;
          animation: spin 3s linear infinite;
        }

        .loading-text {
          font-size: 15px;
          font-weight: 600;
          color: #000000;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .spinner {
            width: 40px;
            height: 40px;
          }

          .loading-text {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};
