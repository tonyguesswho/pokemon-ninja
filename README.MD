# Pokemon Organization Application

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Backend](#backend)
6. [Frontend](#frontend)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Screenshots](#screenshots)

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

git clone https://github.com/tonyguesswho/pokemon-ninja.git
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
- Generate initial data by running:
  ```
  npm run generate-data
  ```

5. Run database migrations:

npx knex migrate:latest

### Running the Application


1. Start the backend server:
  cd backend
  npm run start:dev
  - Backend API Swagger Docs: Navigate to `http://localhost:3000/api` when running locally
2. In a new terminal, start the frontend development server:

cd client
npm run dev
3. Open your browser and navigate to `http://localhost:5173`

## Backend

### API Endpoints

#### Authentication

1. Register a new user
- **POST** `/api/auth/register`
- Request body:
  ```json
  {
      "email": "user@example.com",
      "password": "securepassword",
      "organizationId": 1
  }
  ```
- Response:
  ```json
  {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

2. Login
- **POST** `/api/auth/login`
- Request body:
  ```json
  {
      "email": "user@example.com",
      "password": "securepassword"
  }
  ```
- Response:
  ```json
  {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

3. Get user profile
- **GET** `/api/auth/profile`
- Headers:
  ```
  Authorization: Bearer <access_token>
  ```
- Response:
  ```json
  {
      "id": 1,
      "email": "user@example.com",
      "organization_id": 1,
      "organization_name": "Kanto Trainers"
  }
  ```

#### Pokemon

1. Get Pokemon list
- **GET** `/api/pokemon?page=1&limit=10`
- Headers:
  ```
  Authorization: Bearer <access_token>
  ```
- Response:
  ```json
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
  ```

2. Toggle Pokemon favorite status
- **POST** `/api/pokemon/:id/toggle-favorite`
- Headers:
  ```
  Authorization: Bearer <access_token>
  ```
- Response:
  ```json
  {
      "isFavorited": true
  }
  ```

3. Get all organizations
- **GET** `/api/organizations`
- Response:
  ```json
  [
      {
          "id": 1,
          "name": "Kanto Trainers"
      },
      // ... more organizations
  ]
  ```

## Testing

### Backend
To run the backend tests:


cd backend
npm run test        # For unit tests
npm run test:integration  # For integration tests



## Deployment

- Frontend: `https://pokemon-ninja.vercel.app/`
- Backend: `https://pokemon-ninja.onrender.com/api`



### Home Page
![Home Page](https://github.com/user-attachments/assets/c140cedd-3dab-46e4-bedb-b3bc14aa47ea)

### Home Page Authenticated
![Home Page Authenticated](https://github.com/user-attachments/assets/2074fe23-ddfc-4754-906b-30231f219f4f)

### Pokemon List
![Login Page](https://github.com/user-attachments/assets/fec32d18-819d-422b-9018-35b1df231c3d)



### Login Page
![Login Page](https://github.com/user-attachments/assets/d85f1e05-6d8f-40a7-ba3a-db04c815103b?raw=true)

### Register page
![Register Page](https://github.com/user-attachments/assets/31ab0536-0199-47a9-a4ae-6d2efb405fb6)

### Organisation Dropdwon
![User Profile](https://github.com/user-attachments/assets/e8b0b832-0f10-4365-9a00-87bff0c45212)
