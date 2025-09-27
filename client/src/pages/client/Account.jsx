import React, { useEffect, useState } from "react";
import { loginUser } from "../../api/users";
import "../../styles/client/account.css";
import { Link, useNavigate } from "react-router-dom";
import PopupMessage from "../../components/client/PopMessage";
import { Spinner } from "../../components/client/Spinner";
import { checkAuth } from "../../api/checkAuth";

export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const verify = async () => {
      const res = await checkAuth();
      if (res) {
        if (res.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    };
    verify();
  }, [navigate]);

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 800);
    }
  };

  // const handlePasswordSubmit = async () => {
  //   if (!password.trim()) return;
  //   setIsLoading(true);
  //   try {
  //     const data = await loginUser({ email, password });
  //     setPopup(null);
  //     setTimeout(() => {
  //       setPopup({
  //         status: data.status,
  //         message: data.message,
  //         key: Date.now(),
  //       });
  //     }, 0);
  //     setTimeout(() => {
  //       window.location.href = "/";
  //     }, 2000);
  //   } catch (err) {
  //     const errorMsg = err.response?.data?.message || "Login failed";
  //     setPopup(null);
  //     setTimeout(() => {
  //       setPopup({
  //         status: "error", // <- fixed
  //         message: errorMsg,
  //         key: Date.now(),
  //       });
  //     }, 0);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) return;
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });
      setPopup(null);
      setTimeout(() => {
        setPopup({
          status: data.status,
          message: data.message,
          key: Date.now(),
        });
      }, 0);

      // 🎯 Corrected Logic: Only redirect on successful login
      if (data.status === "success") {
        setTimeout(() => {
          // Check if the user is an admin for proper redirection
          console.log("Data", data.user);
          if (data.user.isAdmin) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 1000); // Wait for the popup to be seen
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setPopup(null);
      setTimeout(() => {
        setPopup({
          status: "error",
          message: errorMsg,
          key: Date.now(),
        });
      }, 0);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    setStep(1);
    setPassword("");
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <div className="login-container">
        <div className="background-pattern">
          <div className="pattern-square pattern-1"></div>
          <div className="pattern-square pattern-2"></div>
          <div className="pattern-square pattern-3"></div>
        </div>
        {popup && (
          <PopupMessage
            key={popup.key} // Use the new unique key
            status={popup.status}
            message={popup.message}
          />
        )}

        <div className="form-container">
          <div className="login-card">
            <div className="card-header">
              <h2 className="card-title">
                {step === 1 ? "MY WORLD STORE ACCOUNT" : "WELCOME BACK"}
              </h2>
              <p className="card-subtitle">
                {step === 1
                  ? "Enter your email to continue"
                  : `Hello, ${email.split("@")[0]}`}
              </p>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <div className="form-section">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleEmailSubmit)}
                    placeholder=" "
                    required
                  />
                  <label className={`form-label ${email ? "active" : ""}`}>
                    EMAIL ADDRESS
                  </label>
                </div>
                <button
                  className="form-button form-button-primary"
                  onClick={handleEmailSubmit}
                  disabled={!email.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      PROCESSING...
                    </div>
                  ) : (
                    "CONTINUE"
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="form-section">
                <div className="input-group">
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
                    placeholder=" "
                    autoFocus
                    required
                  />
                  <label className={`form-label ${password ? "active" : ""}`}>
                    PASSWORD
                  </label>
                </div>
                <button
                  className="form-button form-button-primary"
                  onClick={handlePasswordSubmit}
                  disabled={!password.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      SIGNING IN...
                    </div>
                  ) : (
                    "SIGN IN"
                  )}
                </button>
                <button
                  className="form-button form-button-secondary"
                  onClick={handleBack}
                >
                  BACK
                </button>
              </div>
            )}

            <div className="footer-links">
              <a href="#" className="footer-link">
                FORGOT PASSWORD?
              </a>
              <div className="footer-row">
                <span>NEW TO WORLD STORE?</span>
                <Link to="/account/signup">CREATE ACCOUNT</Link>
              </div>
            </div>
          </div>

          <div className="additional-info">
            <p>EXCLUSIVE ACCESS TO COLLECTIONS & EVENTS</p>
          </div>
        </div>
      </div>
    </>
  );
}
