# Pokemon Organization Application



The Pokemon Organization Application is a web-based platform that allows users to view and interact with Pokemon data within their respective organizations. Users can register, log in, view Pokemon associated with their organization, and mark Pokemon as favorites.

## Features

- User authentication (registration and login)
- Organization-based Pokemon viewing
- Pagination of Pokemon lists
- Favoriting/unfavoriting Pokemon


## Tech Stack

### Backend
- Node.js
- NestJS
- PostgreSQL
- Knex/Objection.js ORM
- JWT for authentication

### Frontend
- Svelte
- TypeScript
- Tailwind CSS
- Vite (build tool)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository:

git clone https://github.com/your-username/pokemon-organization-app.git
cd pokemon-organization-app

2. Install backend dependencies:
cd backend
npm install


3. Install frontend dependencies:
cd client
npm install


4. Set up the database:
- Create a PostgreSQL database
- Copy `.env.example` to `.env` in the backend directory and update the database connection details

5. Run database migrations:
`npx knex migrate:latest`


### Running the Application

1. Start the backend server:
cd backend
npm run start:dev

2. In a new terminal, start the frontend development server:

cd frontend
npm run dev


3. Open your browser and navigate to `http://localhost:5173`

## Backend

### API Endpoints

#### Authentication

##### Register a new user
- **POST** `/api/auth/register`
- Request body:
```json
{
 "email": "user@example.com",
 "password": "securepassword",
 "organizationId": 1
}

Response

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


Login

POST /api/auth/login
Request body:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}



- User authentication (registration and login)
- Organization-based Pokemon viewing
- Pagination of Pokemon lists
- Favoriting/unfavoriting Pokemon
- Responsive design

## Tech Stack

### Backend
- Node.js
- NestJS
- PostgreSQL
- Objection.js ORM
- JWT for authentication

### Frontend
- Svelte
- TypeScript
- Tailwind CSS
- Vite (build tool)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository:
git clone https://github.com/your-username/pokemon-organization-app.git
cd pokemon-organization-app
Copy
2. Install backend dependencies:
cd backend
npm install
Copy
3. Install frontend dependencies:
cd ../frontend
npm install
Copy
4. Set up the database:
- Create a PostgreSQL database
- Copy `.env.example` to `.env` in the backend directory and update the database connection details

5. Run database migrations:
cd ../backend
npm run migrate
Copy
### Running the Application

1. Start the backend server:
cd backend
npm run start:dev
Copy
2. In a new terminal, start the frontend development server:
cd frontend
npm run dev
Copy
3. Open your browser and navigate to `http://localhost:5173`

## Backend

### API Endpoints

#### Authentication

##### Register a new user
- **POST** `/api/auth/register`
- Request body:
```json
{
 "email": "user@example.com",
 "password": "securepassword",
 "organizationId": 1
}

Response:
jsonCopy{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


Login

POST /api/auth/login
Request body:
jsonCopy{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
jsonCopy{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


Get user profile

GET /api/auth/profile

Headers:
Authorization: <access_token>

Response:
{
  "id": 1,
  "email": "user@example.com",
  "organization_id": 1,
  "organization_name": "Kanto Trainers"
}


### Testing

Backend
To run the backend tests:
cd backend
`npm run test` for unit tests

For integration test tests:
`npm run test:integration`