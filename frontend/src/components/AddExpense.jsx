import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AddExpense.css";
import { API_BASE_URL } from "../utils";

const CATEGORIES = ["Rent", "Electricity", "Groceries", "Maintenance", "Salary", "Miscellaneous"];

export default function AddExpense() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    branch: "Main", // optional
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- Handle input change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!formData.title) throw new Error("Please enter a title");
      if (!formData.category) throw new Error("Please select a category");
      if (!formData.amount || formData.amount <= 0) throw new Error("Please enter a valid amount");
      if (!formData.date) throw new Error("Please select a date");

      // Send request to backend
      const response = await axios.post(
        `${API_BASE_URL}/api/expenses/create`, 
        {
          title: formData.title,
          category: formData.category,
          amount: Math.round(parseFloat(formData.amount) * 100) / 100,
          date: new Date(formData.date),
          description: formData.description,
          branch: formData.branch,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Expense added successfully!");

      // Reset form
      setFormData({
        title: "",
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        branch: "Main",
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to add expense");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-container">
      <div className="add-expense-card">
        <div className="card-header">
          <h2>Add New Expense</h2>
          <button className="back-btn" onClick={() => navigate("/dashboard")} aria-label="Go back">
            ← Back
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="expense-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expense title"
              className="form-input"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input form-select"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount <span className="required">*</span>
            </label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="form-input amount-input"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="optional">(Optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              className="form-input form-textarea"
              rows="4"
              maxLength="500"
            />
            <span className="char-count">{formData.description.length}/500</span>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary btn-submit">
              {loading ? "Adding Expense..." : "Add Expense"}
            </button>
            <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
