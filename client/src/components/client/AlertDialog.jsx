import React from "react";

export const AlertDialog = ({
  isOpen = false,
  type = "success", // "success" | "error"
  message,
  onClose = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .dialog {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          max-width: 300px;
          width: 90%;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: pop 0.2s ease-out;
        }

        .message {
          font-size: 15px;
          margin-bottom: 16px;
          font-weight: 500;
          color: ${type === "success" ? "#0a7d32" : "#d70015"};
        }

        .button {
          background: ${type === "success" ? "#0a7d32" : "#d70015"};
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        @keyframes pop {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div className="overlay" onClick={onClose}>
        <div className="dialog" onClick={(e) => e.stopPropagation()}>
          <p className="message">{message}</p>
          <button className="button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </>
  );
};
