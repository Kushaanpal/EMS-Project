ESM-PROJECT - Expense Management System
A full-stack expense management application built with React, Node.js, Express, and MongoDB. Track, categorize, and manage your expenses efficiently.
📋 Table of Contents

1.Features
2.Tech Stack
3.Setup Instructions
4.API Endpoints

✨ Features

User authentication and authorization using JWT(JSON Web Token)
Create, read, update, and delete expenses by the Admin
Categorize expenses
Show total expenditure for current month
Search and filter expenses
Responsive UI with dark theme
Secure API with JWT authentication
Real-time expense tracking

🛠️ Tech Stack
Backend:

Node.js
Express.js
MongoDB
Mongoose
JWT (JSON Web Tokens)

Frontend:

React.js
React Router
Axios
CSS3

🚀 Setup Instructions
Prerequisites
Ensure you have the following installed:

Node.js (v14 or higher)
npm or yarn
MongoDB (local or cloud instance)

Backend Setup


Navigate to the backend directory:
 cd backend
Install dependencies:
 npm install

Create a .env file in the backend root directory with the following variables:

   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000

Start the backend server:

 nodemon index.js
The server will run on http://localhost:5000


Frontend Setup

Navigate to the frontend directory:

cd frontend
Install dependencies:
  npm install

Start the frontend development server:

bash   npm run dev
The application will run on http://localhost:5173


🚀ESM-PROJECT API Documentation
Base URL: http://localhost:5000

Authentication
All protected endpoints require JWT token:
Authorization: Bearer {token}

User Endpoints
Register
httpPOST /api/users/register
json{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
Response: { "success": true, "token": "...", "user": {...} }

Login
httpPOST /api/users/login
json{
  "email": "john@example.com",
  "password": "password123"
}
Response: { "success": true, "token": "...", "user": {...} }

Get Current User
httpGET /api/users/me
Authorization: Bearer {token}
Response: { "success": true, "user": {...} }

Expense Endpoints
Get All Expenses
httpGET /api/expenses/all
Authorization: Bearer {token}
Response: { "success": true, "expenses": [...] }

Create Expense
httpPOST /api/expenses/create
Authorization: Bearer {token}
json{
  "title": "Office Rent",
  "category": "Rent",
  "amount": 5000,
  "date": "2025-10-19",
  "description": "Monthly office rent",
  "branch": "Main"
}
Response: { "success": true, "message": "Expense added successfully", "data": {...} }

Get Expense (For Edit)
httpGET /api/expenses/edit/:id
Response: { "success": true, "expense": {...} }

Update Expense
httpPUT /api/expenses/edit/:id
Authorization: Bearer {token}
json{
  "title": "Updated Title",
  "category": "Category",
  "amount": 6000,
  "date": "2025-10-19",
  "description": "Description",
  "branch": "Main"
}
Response: { "success": true, "message": "Expense updated successfully", "expense": {...} }

Delete Expense
httpDELETE /api/expenses/delete/:id
Authorization: Bearer {token}
Response: { "success": true, "message": "Expense deleted successfully", "expenseId": "..." }
