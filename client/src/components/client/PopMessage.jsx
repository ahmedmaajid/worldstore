// / Basic usage with status only <PopMessage status="success" />

// With custom message <PopMessage status="success" message="Login successful! Welcome back." />

// With custom duration and close handler <PopMessage status="error" message="Invalid credentials" duration={5000} onClose={() => console.log('Popup closed')} autoClose={true} />

// Status Options: success, error, warning, info
// Props: status (required), message, onClose, autoClose, duration

import React, { useState, useEffect } from "react";

export default function PopMessage({
  status,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
}) {
  const [isVisible, setIsVisible] = useState(true);

  const statusConfig = {
    success: {
      title: "SUCCESS",
      defaultMessage: "Operation completed successfully",
      icon: "✓",
    },
    error: {
      title: "ERROR",
      defaultMessage: "Something went wrong. Please try again",
      icon: "✕",
    },
    warning: {
      title: "WARNING",
      defaultMessage: "Please review the information provided",
      icon: "!",
    },
    info: {
      title: "INFORMATION",
      defaultMessage: "Here's some important information for you",
      icon: "i",
    },
  };

  const config = statusConfig[status] || statusConfig.info;
  const displayMessage = message || config.defaultMessage;

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  useEffect(() => {
    setIsVisible(true);
  }, [status, message]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
      body{
      overflow: hidden !important}
        .pop-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          animation: popFadeIn 0.3s ease forwards;
        }

        .pop-container {
          background: #fff;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 0 0 1px #000;
          transform: scale(0.9) translateY(30px);
          animation: popSlideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards 0.1s;
          position: relative;
        }

        .pop-header {
          background: #000;
          color: #fff;
          padding: 25px 30px;
          text-align: center;
          position: relative;
        }

        .pop-close {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Arial, sans-serif;
          transition: opacity 0.3s ease;
        }

        .pop-close:hover {
          opacity: 0.7;
        }

        .pop-icon {
          width: 50px;
          height: 50px;
          border: 1px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          font-size: 24px;
          font-weight: 300;
        }

        .pop-title {
          font-size: 1.3rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .pop-body {
          padding: 40px 30px;
          text-align: center;
        }

        .pop-message {
          font-size: 1rem;
          font-weight: 300;
          color: #333;
          line-height: 1.5;
          letter-spacing: 0.01em;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .pop-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: #000;
          width: 0%;
          animation: progress ${duration}ms linear;
        }

        @keyframes popFadeIn {
          to { opacity: 1; }
        }

        @keyframes popSlideUp {
          to {
            transform: scale(1) translateY(0);
          }
        }

        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        @media (max-width: 768px) {
          .pop-container {
            width: 95%;
            margin: 20px;
          }
          
          .pop-header,
          .pop-body {
            padding-left: 25px;
            padding-right: 25px;
          }
          
          .pop-message {
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className="pop-overlay" onClick={handleClose}>
        <div className="pop-container" onClick={(e) => e.stopPropagation()}>
          <div className="pop-header">
            <button className="pop-close" onClick={handleClose}>
              ×
            </button>
            <div className="pop-icon">{config.icon}</div>
            <h2 className="pop-title">{config.title}</h2>
          </div>

          <div className="pop-body">
            <p className="pop-message">{displayMessage}</p>
          </div>

          {autoClose && <div className="pop-progress"></div>}
        </div>
      </div>
    </>
  );
}

// Demo Component to show usage
// const PopMessageDemo = () => {
//   const [activePopup, setActivePopup] = useState(null);

//   const showPopup = (status, message) => {
//     setActivePopup({ status, message });
//   };

//   const closePopup = () => {
//     setActivePopup(null);
//   };

//   return (
//     <>
//       <style>{`
//         .demo-wrapper {
//           min-height: 100vh;
//           background: #f5f5f5;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 40px 20px;
//           font-family: 'Helvetica Neue', Arial, sans-serif;
//         }

//         .demo-header {
//           text-align: center;
//           margin-bottom: 60px;
//         }

//         .demo-title {
//           font-size: 2.5rem;
//           font-weight: 300;
//           color: #000;
//           letter-spacing: 0.25em;
//           margin-bottom: 15px;
//           text-transform: uppercase;
//         }

//         .demo-subtitle {
//           font-size: 1rem;
//           font-weight: 300;
//           color: #666;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//         }

//         .demo-buttons {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 20px;
//           max-width: 800px;
//           width: 100%;
//           margin-bottom: 50px;
//         }

//         .demo-btn {
//           background: #000;
//           color: #fff;
//           border: none;
//           padding: 18px 30px;
//           font-family: inherit;
//           font-size: 0.9rem;
//           font-weight: 400;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .demo-btn:hover {
//           background: #fff;
//           color: #000;
//           box-shadow: inset 0 0 0 2px #000;
//         }

//         .usage-section {
//           background: #fff;
//           padding: 40px;
//           max-width: 800px;
//           width: 100%;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//         }

//         .usage-title {
//           font-size: 1.2rem;
//           font-weight: 400;
//           color: #000;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           margin-bottom: 30px;
//           text-align: center;
//         }

//         .usage-code {
//           background: #f8f8f8;
//           padding: 20px;
//           font-family: 'Monaco', 'Menlo', monospace;
//           font-size: 0.9rem;
//           color: #333;
//           overflow-x: auto;
//           margin-bottom: 20px;
//           border-left: 3px solid #000;
//         }

//         .usage-example {
//           margin-bottom: 15px;
//         }
//       `}</style>

//       <div className="demo-wrapper">
//         <div className="usage-section">
//           <h3 className="usage-title">How to Use</h3>

//           <div className="usage-example">
//             <div className="usage-code">
//               {`// Basic usage with status only
// <PopMessage status="success" />

// // With custom message
// <PopMessage
//   status="success"
//   message="Login successful! Welcome back."
// />

// // With custom duration and close handler
// <PopMessage
//   status="error"
//   message="Invalid credentials"
//   duration={5000}
//   onClose={() => console.log('Popup closed')}
//   autoClose={true}
// />`}
//             </div>
//           </div>

//           <div style={{ fontSize: "0.9rem", color: "#666", lineHeight: "1.6" }}>
//             <strong>Status Options:</strong> success, error, warning, info
//             <br />
//             <strong>Props:</strong> status (required), message, onClose,
//             autoClose, duration
//           </div>
//         </div>
//       </div>

//       {activePopup && (
//         <PopMessage
//           status={activePopup.status}
//           message={activePopup.message}
//           onClose={closePopup}
//           autoClose={true}
//           duration={4000}
//         />
//       )}
//     </>
//   );
// };
