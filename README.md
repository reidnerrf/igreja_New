
  # Igrejas App Design

  This is a code bundle for Igrejas App Design. The original project is available at https://www.figma.com/design/1gsdJDIkxHfdYqjP7JwnNf/Igrejas-App-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
  ### Backend (API) with Docker + MongoDB
  
  - Create a `.env` inside `backend/` based on `backend/.env.example`
  - Start services:
  
  ```bash
  docker compose up -d --build
  ```
  
  - API health check: `http://localhost:3001/health`
  - MongoDB: `mongodb://localhost:27017/connectfe`
  
  ### Run backend tests locally
  
  ```bash
  cd backend
  npm install
  npm test
  ```
  