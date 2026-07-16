# API Documentation

The Job Portal platform provides a RESTful API. Swagger documentation is available interactively by running the server and navigating to `http://localhost:5000/api-docs`.

Below is a summary of the available endpoints.

## Base URL
`http://localhost:5000/api`

## Authentication (`/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register a new user (Candidate, Employer, Admin) | Public |
| POST | `/auth/login` | Login and receive a JWT token | Public |
| GET | `/auth/me` | Get the profile of the currently logged-in user | Private (Auth Required) |

## Companies (`/companies`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/companies` | Get all companies | Public |
| POST | `/companies` | Create a new company profile | Employer |
| GET | `/companies/:id` | Get a specific company profile | Public |
| PUT | `/companies/:id` | Update a company profile | Employer / Admin |
| DELETE | `/companies/:id` | Delete a company profile | Admin |

## Jobs (`/jobs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/jobs` | Get all jobs (with filtering, pagination) | Public |
| POST | `/jobs` | Create a new job listing | Employer |
| GET | `/jobs/:id` | Get specific job details | Public |
| PUT | `/jobs/:id` | Update a job listing | Employer / Admin |
| DELETE | `/jobs/:id` | Delete a job listing | Employer / Admin |

## Applications (`/applications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/applications` | Get all applications (for user/employer) | Private |
| POST | `/applications` | Apply for a job | Candidate |
| GET | `/applications/:id`| Get specific application details | Private |
| PUT | `/applications/:id`| Update application status (e.g., Accept/Reject) | Employer |

## Dashboard (`/dashboard`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard` | Get dashboard statistics based on role | Private |

## Admin (`/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/admin/users` | Get all users | Admin |
| PUT | `/admin/users/:id` | Update user details or role | Admin |
| DELETE | `/admin/users/:id` | Delete a user | Admin |

## Scraper (`/scrape`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/scrape/jobs` | Trigger external job aggregation/scraping | Admin |

---
**Note:** For private endpoints, ensure to pass the `Authorization` header with the Bearer Token:
`Authorization: Bearer <your-jwt-token>`
