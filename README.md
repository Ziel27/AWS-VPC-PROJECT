# AWS VPC Project - MERN Stack

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing AWS VPC configurations.

## 🚀 Features

- Create, read, update, and delete VPC configurations
- Modern, responsive UI
- RESTful API backend
- MongoDB database integration
- Real-time data synchronization

## 📁 Project Structure

```
aws-vpc-project/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── client/                # Frontend (React + Vite)
│   ├── src/               # React source files
│   ├── index.html         # HTML entry point
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aws-vpc
   NODE_ENV=development
   ```

   For MongoDB Atlas, use:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aws-vpc
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory (optional):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## 🔌 API Endpoints

- `GET /api/vpcs` - Get all VPCs
- `GET /api/vpcs/:id` - Get a single VPC by ID
- `POST /api/vpcs` - Create a new VPC
- `PUT /api/vpcs/:id` - Update a VPC
- `DELETE /api/vpcs/:id` - Delete a VPC
- `GET /health` - Health check endpoint

## 📝 VPC Model

```javascript
{
  name: String (required),
  cidrBlock: String (required, format: IP/CIDR),
  region: String (required),
  status: String (enum: 'pending', 'available', 'deleting'),
  description: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Technologies Used

- **Frontend**: React, Vite, Axios, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Other**: CORS, dotenv

## 📦 Running Both Servers

To run both frontend and backend simultaneously:

1. Open two terminal windows
2. In terminal 1: `cd server && npm start` (or `npm run dev` for auto-reload)
3. In terminal 2: `cd client && npm run dev`

## 🔒 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## 🐛 Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running locally or your Atlas connection string is correct
- **CORS Errors**: The backend is configured with CORS to allow requests from the frontend
- **Port Already in Use**: Change the PORT in the `.env` file if 5000 is already in use

## 📄 License

ISC

