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
├── Screenshots/
│   ├── applicants.png
│   ├── employer-dashboard.png
│   ├── home.png
│   ├── job-details.png
│   ├── jobs.png
│   └── jobseeker-dashboard.png
│
├── .gitignore
└── README.md
```

## 📸 Screenshots

### 🏠 Home Page

![CareerConnect Home](Screenshots/home.png)

### 🔎 Jobs Page

![Jobs Page](Screenshots/jobs.png)

### 📄 Job Details

![Job Details](Screenshots/job-details.png)

### 👤 Job Seeker Dashboard

![Job Seeker Dashboard](Screenshots/jobseeker-dashboard.png)

### 🏢 Employer Dashboard

![Employer Dashboard](Screenshots/employer-dashboard.png)

### 👥 Applicants Management

![Applicants Management](Screenshots/applicants.png)

## 🔐 Authentication

CareerConnect uses JWT-based authentication.

The application supports two roles:

- **Job Seeker**
- **Employer**

Protected backend routes require a valid JWT token.

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/Nikhilupadhyay08/CareerConnect.git
cd CareerConnect
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=4000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:4000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## 📡 API Overview

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PATCH  /api/auth/profile
```

### Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
GET    /api/jobs/my-jobs
POST   /api/jobs
PATCH  /api/jobs/:id
DELETE /api/jobs/:id
```

### Applications

```text
POST   /api/applications
GET    /api/applications/my-applications
GET    /api/applications/job/:jobId
PATCH  /api/applications/:applicationId/status
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT authentication protects private routes
- Role-based authorization restricts employer and job-seeker actions
- Environment variables are excluded from Git
- Resume uploads are restricted to PDF files
- Resume upload size is limited to 5 MB

## 🧪 Testing

Backend APIs were tested using Postman, including:

- User registration
- User login
- JWT protected routes
- Job creation
- Job updates
- Job deletion
- Job searching and filtering
- Resume uploads
- Job applications
- Applicant management
- Application status updates

## ☁️ Deployment

Planned deployment:

- Frontend: Vercel
- Backend: Cloud hosting
- Database: MongoDB Atlas
- Resume storage: Cloudinary

## 🔮 Future Improvements

- Email notifications
- Advanced job recommendations
- Employer analytics dashboard
- Job bookmarking
- Pagination
- Advanced candidate search
- Application activity timeline

## 👨‍💻 Author

**Nikhil Upadhyay**

Computer Science graduate focused on full-stack web development and software engineering.

GitHub:  
https://github.com/Nikhilupadhyay08

LeetCode:  
https://leetcode.com/u/nikhilup_08/