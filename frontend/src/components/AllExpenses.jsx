import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AllExpenses.css";
import { API_BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

export default function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(null); // Track which expense is being deleted
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch all expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/expenses/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data.expenses);
      setFilteredExpenses(res.data.expenses);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter expenses whenever searchTerm changes
  useEffect(() => {
    const lowercased = searchTerm.toLowerCase();
    const filtered = expenses.filter(
      exp =>
        exp.title.toLowerCase().includes(lowercased) ||
        exp.category.toLowerCase().includes(lowercased)
    );
    setFilteredExpenses(filtered);
  }, [searchTerm, expenses]);

  // --- Handle Edit ---
  const handleEdit = (id) => {
    navigate(`/expenses/edit/${id}`);
  };

  // --- Handle Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setDeleting(id);
    try {
      await axios.delete(
        `${API_BASE_URL}/api/expenses/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove expense from list
      setExpenses(expenses.filter(exp => exp._id !== id));
      setFilteredExpenses(filteredExpenses.filter(exp => exp._id !== id));
      alert("Expense deleted successfully!");
    } catch (err) {
      console.error("Failed to delete expense:", err);
      alert(err.response?.data?.message || "Failed to delete expense");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading expenses...</div>;
  }

  return (
    <div className="all-expenses-container">
      <div className="expenses-header">
        <button 
          className="back-btn" 
          onClick={() => navigate("/dashboard")}
          title="Go back to dashboard"
        >
          ← Back
        </button>
        <h2>All Expenses</h2>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(exp => (
              <tr key={exp._id}>
                <td>{exp.title}</td>
                <td>{exp.category}</td>
                <td>${exp.amount.toLocaleString()}</td>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
                <td>{exp.description}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(exp._id)}
                      title="Edit expense"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(exp._id)}
                      disabled={deleting === exp._id}
                      title="Delete expense"
                    >
                      {deleting === exp._id ? "Deleting..." : "🗑️ Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}