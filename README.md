# CareerConnect

A full-stack MERN job portal that connects job seekers and employers through a secure and role-based recruitment platform.

## 🚀 Features

### 👤 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Separate workflows for Job Seekers and Employers
- Protected routes

### 🔎 Job Seeker
- Browse available jobs
- Search jobs by title or company
- Filter jobs by location and job type
- View detailed job information
- Apply for jobs
- Upload resume in PDF format
- Track submitted applications
- View application status
- Manage profile

### 🏢 Employer
- Create job postings
- Edit existing job postings
- Delete job postings
- View posted jobs
- View applicants for each job
- Update application status
- Manage employer profile

### 📄 Resume Management
- PDF resume upload
- File size validation
- Cloudinary integration for cloud storage

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer

### Cloud & Tools
- Cloudinary
- Git & GitHub
- Postman
- MongoDB Atlas

## 🏗️ Project Structure

```text
CareerConnect/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md