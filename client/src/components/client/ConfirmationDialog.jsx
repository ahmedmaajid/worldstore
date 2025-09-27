import React from "react";

export const ConfirmationDialog = ({
  isOpen = false,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm = () => {},
  onCancel = () => {},
  variant = "default", // "default", "destructive"
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

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
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1003;
          animation: fadeIn 0.15s ease-out;
        }

        .dialog {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 24px;
          max-width: 320px;
          width: 90%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: slideIn 0.2s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .title {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          text-align: center;
          margin-bottom: 8px;
          line-height: 1.3;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .message {
          font-size: 13px;
          color: #86868b;
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.4;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .buttons {
          display: flex;
          gap: 12px;
        }

        .button {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          outline: none;
        }

        .button:active {
          transform: scale(0.98);
        }

        .cancel-button {
          background: rgba(120, 120, 128, 0.16);
          color: #007aff;
        }

        .cancel-button:hover {
          background: rgba(120, 120, 128, 0.24);
        }

        .confirm-button {
          background: #007aff;
          color: white;
        }

        .confirm-button:hover {
          background: #0056d6;
        }

        .confirm-button.destructive {
          background: #ff3b30;
        }

        .confirm-button.destructive:hover {
          background: #d70015;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .dialog {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Dark mode support - disabled for white theme */
        @media (prefers-color-scheme: dark) {
          .dialog {
            background: #ffffff;
            border: 1px solid rgba(0, 0, 0, 0.08);
          }

          .title {
            color: #1d1d1f;
          }

          .message {
            color: #86868b;
          }

          .cancel-button {
            background: #f2f2f7;
            color: #1d1d1f;
          }

          .cancel-button:hover {
            background: #e5e5ea;
          }
        }
      `}</style>

      <div className="overlay" onClick={handleCancel}>
        <div className="dialog" onClick={(e) => e.stopPropagation()}>
          <h3 className="title">{title}</h3>
          <p className="message">{message}</p>
          <div className="buttons">
            <button className="button cancel-button" onClick={handleCancel}>
              {cancelText}
            </button>
            <button
              className={`button confirm-button ${
                variant === "destructive" ? "destructive" : ""
              }`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Example usage:
/*
import ConfirmationDialog from './ConfirmationDialog';

// Default confirmation
<ConfirmationDialog
  isOpen={showDefault}
  onConfirm={() => handleConfirm()}
  onCancel={() => setShowDefault(false)}
/>

// Destructive action
<ConfirmationDialog
  isOpen={showDelete}
  title="Delete Item?"
  message="This item will be permanently deleted and cannot be recovered."
  confirmText="Delete"
  cancelText="Cancel"
  variant="destructive"
  onConfirm={() => handleDelete()}
  onCancel={() => setShowDelete(false)}
/>

// Custom confirmation
<ConfirmationDialog
  isOpen={showSave}
  title="Save Changes?"
  message="You have unsaved changes. Would you like to save before continuing?"
  confirmText="Save"
  cancelText="Don't Save"
  onConfirm={() => handleSave()}
  onCancel={() => setShowSave(false)}
/>
*/
