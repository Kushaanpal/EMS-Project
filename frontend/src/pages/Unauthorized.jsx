import React from 'react';

export default function Unauthorized() {
  const styles = `
    :root {
      --primary-color: #3b82f6;
      --secondary-color: #10b981;
      --error-color: #ef4444;
      --background-color: #0f172a;
      --card-background: #1e293b;
      --text-color: #f1f5f9;
      --subtle-text: #cbd5e1;
      --border-color: rgba(71, 85, 105, 0.3);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .unauthorized-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }

    .unauthorized-container::before {
      content: '';
      position: fixed;
      top: 20px;
      left: 40px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      z-index: 0;
    }

    .unauthorized-container::after {
      content: '';
      position: fixed;
      bottom: 40px;
      right: 80px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      z-index: 0;
    }

    .unauthorized-card {
      background: rgba(30, 41, 59, 0.5);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid var(--border-color);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      padding: 60px 40px;
      max-width: 500px;
      text-align: center;
      position: relative;
      z-index: 10;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .error-icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .unauthorized-card h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--error-color), #dc2626);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 16px;
    }

    .unauthorized-card p {
      font-size: 1rem;
      color: var(--subtle-text);
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .error-code {
      font-size: 0.85rem;
      color: var(--primary-color);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
      padding: 12px 16px;
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid var(--primary-color);
      border-radius: 4px;
    }

    .unauthorized-actions {
      display: flex;
      gap: 12px;
      flex-direction: column;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary-color), #2563eb);
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: rgba(30, 41, 59, 0.5);
      color: var(--text-color);
      border: 2px solid var(--border-color);
    }

    .btn-secondary:hover {
      background: rgba(30, 41, 59, 0.7);
      border-color: var(--primary-color);
      color: var(--primary-color);
      transform: translateY(-2px);
    }

    @media (max-width: 600px) {
      .unauthorized-card {
        padding: 40px 24px;
      }

      .unauthorized-card h1 {
        font-size: 2rem;
      }

      .error-icon {
        font-size: 60px;
      }

      .unauthorized-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="unauthorized-container">
        <div className="unauthorized-card">
          <div className="error-icon">🔒</div>
          <h1>Access Denied</h1>
          <div className="error-code">Error 403 - Unauthorized</div>
          <p>You do not have permission to view this page. Please contact your administrator if you believe this is an error.</p>
          <div className="unauthorized-actions">
            <button className="btn btn-primary" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </button>
            <button className="btn btn-secondary" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}