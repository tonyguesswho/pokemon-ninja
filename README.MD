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
- Copy `.env.sample` to `.env` in the backend directory and update the database connection details

- Genrate initial Data by running
  `npm run generate-data` script located at `backend/src/scripts/generate-data.tsgenerate-data.ts`

5. Run database migrations:
`npx knex migrate:latest`

### Testing

Backend
To run the backend tests:
cd backend
`npm run test` for unit tests

For integration test tests:
`npm run test:integration`


### Running the Application

1. Start the backend server:
cd backend
npm run start:dev

2. In a new terminal, start the frontend development server:

cd frontend
npm run dev

- Copy `.env.sample` to `.env` in the client directory and update the API URL


3. Open your browser and navigate to `http://localhost:5173`

- API url = `http://localhost:3000/`
- Access backend api swagger docs navigate `http://localhost:3000/api`



### Deployed Application
- Frontend: `https://pokemon-ninja.vercel.app/`

- Backend - `https://pokemon-ninja.onrender.com/api`

### API Endpoints

#### Authentication

##### Register a new user
    **POST** `/api/auth/register`
    Request body:
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



    Get Pokemon list

    GET /api/pokemon?page=1&limit=10
    Headers:
    Authorization: Bearer <access_token>

    Response:
    {
    "pokemons": [
        {
        "id": 1,
        "name": "Bulbasaur",
        "height": 7,
        "weight": 69,
        "isFavorite": false
        },
        // ... more Pokemon
    ],
    "total": 150
    }

Certainly! Here's an extensive README.md file in Markdown format that describes both the backend and frontend of your Pokemon application. You can add the frontend screenshots where indicated.
markdownCopy# Pokemon Organization Application

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
5. [Backend](#backend)
   - [API Endpoints](#api-endpoints)
   - [Database Schema](#database-schema)
6. [Frontend](#frontend)
   - [Components](#components)
   - [State Management](#state-management)
7. [Screenshots](#screenshots)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)

## Introduction

The Pokemon Organization Application is a web-based platform that allows users to view and interact with Pokemon data within their respective organizations. Users can register, log in, view Pokemon associated with their organization, and mark Pokemon as favorites.

## Features

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
CopyAuthorization: Bearer <access_token>

Response:
jsonCopy{
  "id": 1,
  "email": "user@example.com",
  "organization_id": 1,
  "organization_name": "Kanto Trainers"
}


Pokemon
Get Pokemon list

GET /api/pokemon?page=1&limit=10
Headers:
Authorization: Bearer <access_token>

Response:
{
  "pokemons": [
    {
      "id": 1,
      "name": "Bulbasaur",
      "height": 7,
      "weight": 69,
      "isFavorite": false
    },
    // ... more Pokemon
  ],
  "total": 150
}


Toggle Pokemon favorite status

POST /api/pokemon/:id/toggle-favorite
Headers:
Authorization: Bearer <access_token>

Response:
{
  "isFavorited": true
}


Get all organizations

GET /api/organizations
Response:
[
  {
    "id": 1,
    "name": "Kanto Trainers"
  },
  // ... more organizations
]