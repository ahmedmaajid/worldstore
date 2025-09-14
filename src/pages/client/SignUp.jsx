import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../../api/users";
import PopupMessage from "../../components/client/PopMessage";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    acceptTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [popup, setPopup] = useState(null);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";
        break;
      case 2:
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        break;
      case 3:
        if (!formData.password.trim())
          newErrors.password = "Password is required";
        if (formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters";
        if (!formData.confirmPassword.trim())
          newErrors.confirmPassword = "Please confirm your password";
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
      case 4:
        if (!formData.acceptTerms)
          newErrors.acceptTerms = "Please accept the terms and conditions";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(step + 1);
      }, 800);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      setIsLoading(true);
      try {
        const data = await createUser(formData); // assuming it returns {status, message}
        setPopup({
          status: data.status || "success",
          message: data.message || "Account created successfully!",
          key: Date.now(),
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (err) {
        setPopup({
          status: "error",
          message: err.message || "Something went wrong",
          key: Date.now(),
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: "CREATE YOUR ACCOUNT",
      2: "YOUR EMAIL ADDRESS",
      3: "SECURE YOUR ACCOUNT",
      4: "FINAL DETAILS",
    };
    return titles[step];
  };

  const getStepSubtitle = () => {
    const subtitles = {
      1: "Tell us your name",
      2: "We'll use this to contact you",
      3: "Choose a strong password",
      4: "Just a few more details",
    };
    return subtitles[step];
  };

  return (
    <>
      {popup && (
        <PopupMessage
          key={popup.key}
          message={popup.message}
          status={popup.status}
          onClose={() => setPopup(null)}
        />
      )}

      <style>{`
        .signup-container {
        font-family: "Manrope", Inter;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }

        .container {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 10;
        }

        .brand {
          text-align: center;
          margin-bottom: 48px;
        }

        .brand h1 {
          color: white;
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 0.3em;
          margin-bottom: 8px;
        }

        .brand-line {
            width: 64px;
          height: 1px;
          background-color: white;
          margin: 0 auto;
        }

        .signup-card {
          background-color: white;
          padding: 32px;
          position: relative;
        }

        .progress-bar {
          display: flex;
          margin-bottom: 32px;
          gap: 8px;
        }

        .progress-step {
          flex: 1;
          height: 2px;
          background-color: #e5e5e5;
          transition: background-color 0.3s ease;
        }

        .progress-step.active {
          background-color: #000;
        }

        .card-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .card-title {
          color: black;
          font-weight: 500;
          font-size: 20px;
          letter-spacing: 0.2em;
          margin-bottom: 8px;
        }

        .card-subtitle {
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }

        .form-section {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-row .input-group {
          flex: 1;
        }

        .input-group {
          position: relative;
          margin-bottom: 24px;
        }

        .form-input {
          width: 100%;
          padding: 12px 0;
          font-size: 14px;
          color: black;
          background: transparent;
          border: none;
          border-bottom: 1px solid #ccc;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          border-bottom-color: black;
        }

        .form-input.error {
          border-bottom-color: #dc2626;
        }

        .form-label {
          position: absolute;
          left: 0;
          top: 12px;
          font-size: 14px;
          color: #999;
          pointer-events: none;
          transition: all 0.3s ease;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .form-label.active {
          top: -8px;
          font-size: 12px;
          color: #666;
          transform: translateY(-8px);
        }

        .error-message {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
          letter-spacing: 0.05em;
        }

        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
          cursor: pointer;
        }

        .checkbox-label a {
          color: black;
          text-decoration: none;
          border-bottom: 1px solid black;
        }

        .checkbox-label a:hover {
          opacity: 0.8;
        }

        .btn {
          width: 100%;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          font-weight: 500;
        }

        .btn-primary {
          background-color: black;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #333;
        }

        .btn-secondary {
          background-color: transparent;
          color: black;
          border: 1px solid #ccc;
          margin-top: 16px;
        }

        .btn-secondary:hover {
          border-color: black;
          background-color: #f9f9f9;
        }

        .btn:disabled {
          background-color: #999;
          cursor: not-allowed;
        }

        .loading {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .footer-links {
          margin-top: 32px;
          text-align: center;
        }

        .footer-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-size: 12px;
          color: #666;
        }

        .footer-row a {
          color: #666;
          text-decoration: none;
          letter-spacing: 0.1em;
          transition: color 0.3s ease;
        }

        .footer-row a:hover {
          color: black;
        }

        .additional-info {
          text-align: center;
          margin-top: 32px;
        }

        .additional-info p {
          color: #999;
          font-size: 12px;
          letter-spacing: 0.1em;
        }

        .background-pattern {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.05;
          z-index: 1;
        }

        .pattern-square {
          position: absolute;
          border: 1px solid white;
          transform: rotate(45deg);
        }

        .pattern-1 {
          top: 20%;
          left: 20%;
          width: 128px;
          height: 128px;
        }

        .pattern-2 {
          bottom: 20%;
          right: 20%;
          width: 96px;
          height: 96px;
        }

        .pattern-3 {
          top: 60%;
          right: 30%;
          width: 64px;
          height: 64px;
        }

        .pattern-4 {
          top: 40%;
          left: 80%;
          width: 48px;
          height: 48px;
        }

        @media (max-width: 480px) {
          .container {
            max-width: 340px;
          }
          
          .signup-card {
            padding: 0;
          }
          
          .brand h1 {
            font-size: 20px;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>

      <div className="signup-container">
        <div className="background-pattern">
          <div className="pattern-square pattern-1"></div>
          <div className="pattern-square pattern-2"></div>
          <div className="pattern-square pattern-3"></div>
          <div className="pattern-square pattern-4"></div>
        </div>

        <div className="container">
          <div className="brand">
            <h1>MAISON LUXE</h1>
            <div className="brand-line"></div>
          </div>

          <div className="signup-card">
            {/* Progress Bar */}
            <div className="progress-bar">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`progress-step ${i <= step ? "active" : ""}`}
                ></div>
              ))}
            </div>

            <div className="card-header">
              <h2 className="card-title">{getStepTitle()}</h2>
              <p className="card-subtitle">{getStepSubtitle()}</p>
            </div>

            {/* Step 1: Name */}
            {step === 1 && (
              <div className="form-section">
                <div className="form-row">
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-input ${
                        errors.firstName ? "error" : ""
                      }`}
                      value={formData.firstName}
                      onChange={(e) =>
                        updateFormData("firstName", e.target.value)
                      }
                      onKeyPress={(e) => handleKeyPress(e, handleNext)}
                      placeholder=" "
                    />
                    <label
                      className={`form-label ${
                        formData.firstName ? "active" : ""
                      }`}
                    >
                      FIRST NAME
                    </label>
                    {errors.firstName && (
                      <div className="error-message">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-input ${errors.lastName ? "error" : ""}`}
                      value={formData.lastName}
                      onChange={(e) =>
                        updateFormData("lastName", e.target.value)
                      }
                      onKeyPress={(e) => handleKeyPress(e, handleNext)}
                      placeholder=" "
                    />
                    <label
                      className={`form-label ${
                        formData.lastName ? "active" : ""
                      }`}
                    >
                      LAST NAME
                    </label>
                    {errors.lastName && (
                      <div className="error-message">{errors.lastName}</div>
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={isLoading}
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

            {/* Step 2: Email */}
            {step === 2 && (
              <div className="form-section">
                <div className="input-group">
                  <input
                    type="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleNext)}
                    placeholder=" "
                    autoFocus
                  />
                  <label
                    className={`form-label ${formData.email ? "active" : ""}`}
                  >
                    EMAIL ADDRESS
                  </label>
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={isLoading}
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
                <button className="btn btn-secondary" onClick={handleBack}>
                  BACK
                </button>
              </div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <div className="form-section">
                <div className="input-group">
                  <input
                    type="password"
                    className={`form-input ${errors.password ? "error" : ""}`}
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    placeholder=" "
                    autoFocus
                  />
                  <label
                    className={`form-label ${
                      formData.password ? "active" : ""
                    }`}
                  >
                    PASSWORD
                  </label>
                  {errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    className={`form-input ${
                      errors.confirmPassword ? "error" : ""
                    }`}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateFormData("confirmPassword", e.target.value)
                    }
                    onKeyPress={(e) => handleKeyPress(e, handleNext)}
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      formData.confirmPassword ? "active" : ""
                    }`}
                  >
                    CONFIRM PASSWORD
                  </label>
                  {errors.confirmPassword && (
                    <div className="error-message">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={isLoading}
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
                <button className="btn btn-secondary" onClick={handleBack}>
                  BACK
                </button>
              </div>
            )}

            {/* Step 4: Final Details */}
            {step === 4 && (
              <div className="form-section">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    id="terms"
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      updateFormData("acceptTerms", e.target.checked)
                    }
                  />
                  <label htmlFor="terms" className="checkbox-label">
                    I accept the <a href="#">Terms & Conditions</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <div className="error-message">{errors.acceptTerms}</div>
                )}

                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      CREATING ACCOUNT...
                    </div>
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </button>
                <button className="btn btn-secondary" onClick={handleBack}>
                  BACK
                </button>
              </div>
            )}

            <div className="footer-links">
              <div className="footer-row">
                <span>ALREADY HAVE AN ACCOUNT?</span>
                <Link to="/account/login">SIGN IN</Link>
              </div>
            </div>
          </div>

          <div className="additional-info">
            <p>JOIN OUR EXCLUSIVE COMMUNITY</p>
          </div>
        </div>
      </div>
    </>
  );
}
