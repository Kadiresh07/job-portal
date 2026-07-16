# AI Job Portal with Job Aggregation

An advanced Job Portal platform that integrates AI-powered job aggregation, enabling seamless connections between employers and candidates.

## Features
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Role-Based Access**: Dedicated workflows and dashboards for Admin, Employer, and Candidate roles.
- **Company Management**: Employers can manage their company profiles, while admins have oversight.
- **Job Management**: Complete CRUD operations for job postings.
- **Applications**: Candidates can easily apply to jobs, and employers can review applications.
- **Saved Jobs**: Candidates can save job listings for future reference.
- **Job Scraping**: Automated job aggregation to populate the platform with external opportunities.
- **Admin Dashboard**: Comprehensive dashboard for platform management and statistics.
- **Resume Upload**: Candidates can upload and manage their resumes.
- **Swagger API**: Full API documentation available via Swagger UI.
- **Rate Limiting**: API rate limiting to ensure platform stability and security.

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd "Job Porta"
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd server (or backend folder, check your directory structure)

# Install dependencies
npm install

# Create a .env file and configure the environment variables
# Example variables: PORT, MONGO_URI, JWT_SECRET, etc.
cp .env.example .env

# Start the backend server
npm start
# or for development: npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to the frontend directory
cd client

# Install dependencies
npm install

# Create a .env.local file if needed for frontend environment variables
# e.g., NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

### 4. Access the Application
- **Frontend**: Open your browser and navigate to `http://localhost:3000`
- **Backend API Docs**: Swagger UI is typically available at `http://localhost:<backend-port>/api-docs` (Check backend setup for specific route).
