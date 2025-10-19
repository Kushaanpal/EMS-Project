import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/Dashboard.css";
import { API_BASE_URL } from "../utils";


const CATEGORIES = ["Rent", "Electricity", "Groceries", "Maintenance", "Salary", "Miscellaneous"];
const CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({ totalCurrentMonth: 0, categorySpending: [] });
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDateRange, setFilterDateRange] = useState("Current Month");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- Fetch user info directly using token ---
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // --- Fetch dashboard data ---
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/expenses/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let expenses = res.data.expenses;

      // --- Filter by category ---
      if (filterCategory !== "All") {
        expenses = expenses.filter((exp) => exp.category === filterCategory);
      }

      // --- Filter by date range ---
      const now = new Date();
      if (filterDateRange === "Current Month") {
        expenses = expenses.filter((exp) => {
          const d = new Date(exp.date);
          return d.getUTCMonth() === now.getUTCMonth() && d.getUTCFullYear() === now.getUTCFullYear();
        });
      } else if (filterDateRange === "Last 3 Months") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setUTCMonth(now.getUTCMonth() - 2);
        expenses = expenses.filter((exp) => {
          const d = new Date(exp.date);
          return d >= threeMonthsAgo && d <= now;
        });
      }

      const totalCurrentMonth = expenses.reduce((acc, exp) => acc + exp.amount, 0);

      const categorySpending = CATEGORIES.map((cat) => ({
        name: cat,
        category: cat,
        amount: expenses
          .filter((exp) => exp.category === cat)
          .reduce((acc, exp) => acc + exp.amount, 0),
      })).filter((item) => item.amount > 0);

      setDashboardData({ totalCurrentMonth, categorySpending });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Initial load ---
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchDashboardData();
    };
    init();
  }, [filterCategory, filterDateRange]);

  // --- Logout handler ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading || !user) {
    return <div className="dashboard-loading-screen">Loading dashboard...</div>;
  }

  const isAdmin = user.role === "admin";
  const chartData = dashboardData.categorySpending.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    if (percent > 0.05) {
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          className="chart-label"
        >
          {`${name} ${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-bar">
        <h2>Expense Dashboard</h2>
        <div>
          <span className="user-role">{user.name} ({user.role})</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-filters">
        <div className="filter-group">
          <label className="filter-label">Category Filter</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Date Range Filter</label>
          <select value={filterDateRange} onChange={(e) => setFilterDateRange(e.target.value)} className="filter-select">
            <option value="Current Month">Current Month</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Custom Range">All Time</option>
          </select>
        </div>

        {isAdmin && (
          <div className="filter-group action-group">
            <button onClick={() => navigate("/expenses/add")} className="btn btn-primary">
              + Create Expense
            </button>
            <a href="/expenses/all" className="btn btn-primary">View All Expenses</a>
          </div>
        )}
      </div>

      <div className="summary-grid">
        <div className="summary-card total-monthly">
          <h3 className="card-title">Total Monthly Expenditure</h3>
          <p className="card-amount">${dashboardData.totalCurrentMonth.toLocaleString()}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-panel">
          <h3 className="panel-title">Category-wise Spending</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="quick-list-panel">
          <h3 className="panel-title">Top 5 Expenses This Month</h3>
          <ul className="expense-list">
            {dashboardData.categorySpending
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map((item) => (
                <li key={item.category} className="expense-item">
                  <span className="expense-name">{item.category}</span>
                  <span className="expense-amount error-text">${item.amount.toLocaleString()}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}