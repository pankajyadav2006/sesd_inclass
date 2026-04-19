# Student Management System (SMS)

A professional, full-stack Student Management System built with a Clean Architecture approach.

## 🚀 Features

- **Role-Based Access Control (RBAC):** Distinct dashboards for Students and Instructors.
- **Course Management:** Instructors can create, update, and delete courses.
- **Enrollment System:** Students can browse the catalog, enroll in courses, and drop them.
- **Interactive UI:** High-performance React frontend with search, filtering, and real-time toast notifications.
- **Futuristic Aesthetics:** Premium glassmorphism design using Vanilla CSS and Framer Motion.
- **Clean Architecture:** Domain-driven design with Repository and Service patterns for a maintainable backend.

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose.
- **Security:** JWT Authentication, Bcrypt password hashing.

## 📊 Architecture Diagrams

- [Entity Relationship Diagram](./ErDiagram.md)
- [Class Diagram](./classDiagram.md)
- [Sequence Diagram](./sequenceDiagram.md)
- [Use Case Diagram](./useCaseDiagram.md)

## 📦 Project Structure

- `/backend`: Node.js/Express REST API.
- `/frontend`: React/TypeScript client app.
- `/sms-enterprise`: (In-progress) Enterprise-grade backend with advanced scheduling and waitlists.

## 📝 Local Setup

1. **Backend:**
   - `cd backend`
   - `npm install`
   - `npm run dev` (Runs on port 5005)

2. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev` (Runs on port 5174)

## 🌐 Deployment

- **Backend:** Hosted on [Render](https://render.com).
- **Frontend:** Hosted on [Vercel](https://vercel.com).
