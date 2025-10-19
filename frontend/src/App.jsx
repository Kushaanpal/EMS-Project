import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import Dashboard from "./components/DashBoard";
import AddExpense from "./components/AddExpense";
import AllExpenses from "./components/AllExpenses";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import EditExpense from "./components/EditExpense";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/dashboard" element={<Dashboard />}/>

        <Route
          path="/expenses/all"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllExpenses />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/expenses/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddExpense />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditExpense/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
