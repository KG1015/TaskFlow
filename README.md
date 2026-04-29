# TaskFlow - Mini SaaS Task Management System

A production-ready mini-SaaS Task Management application built with the PERN stack. It features secure authentication, multi-user functionality, and a dynamic responsive user interface.

## 🚀 Features Implemented

- **Secure Authentication:** Complete Signup and Login flows with encrypted passwords (bcrypt) and JWT-based protected routes.
- **Multi-User Architecture:** Users are strictly isolated; each user can only view, create, update, and delete their own tasks.
- **Task Management (CRUD):** 
  - Create new tasks with titles and descriptions.
  - View a dashboard of pending and completed tasks.
  - Update task statuses interactively.
  - Delete tasks securely.
- **Production-Ready Backend:** Centralized error-handling middleware, clean MVC folder structure, and strict input validation using Joi.
- **Modern UI/UX:** Built with React and Tailwind CSS v4, featuring micro-animations, empty states, and a premium clean design.

---

## 💻 Tech Stack Used

### Backend
- **Node.js & Express:** Core server framework.
- **PostgreSQL:** Primary relational database.
- **Sequelize:** Object-Relational Mapper (ORM) for secure database queries.
- **JWT & bcrypt:** For authentication and password hashing.
- **Joi:** For robust API input validation.

### Frontend
- **React 19:** Frontend UI library.
- **Vite:** Next-generation frontend tooling and bundler.
- **Tailwind CSS v4:** Utility-first CSS framework for styling.
- **Axios:** For API requests and interceptors.
- **React Router Dom:** For client-side routing and protected routes.

---

## 🛠️ Local Setup Steps

Follow these instructions to run the application on your local machine.

### Prerequisites
- Node.js installed
- A running PostgreSQL instance (or a cloud DB like Neon/Supabase)

### 1. Database Setup
Ensure you have a PostgreSQL database running and a connection string available (e.g., `postgresql://user:password@localhost:5432/taskmanager`).

### 2. Backend Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd task-manager/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   PORT=5001
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=any_random_secret_key_here
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(The database tables will be created automatically via Sequelize sync).*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd task-manager/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and add the backend URL:
   ```env
   VITE_API_URL=http://localhost:5001
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173` to view the app!
