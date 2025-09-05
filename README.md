# Tutor Bridge

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

Tutor Bridge is a full-stack web application designed to connect tutors and students. It provides a platform for students to explore tutors, create posts, and manage their profiles, while tutors can register, manage their services, and interact with students.

## Features

### Backend
- **Authentication**: Secure user authentication using JWT.
- **User Management**: CRUD operations for user profiles.
- **Post Management**: Create, edit, and delete posts.
- **Database Integration**: MongoDB for data storage.
- **Modular Architecture**: Organized into modules for scalability and maintainability.

### Frontend
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Authentication Pages**: Login and registration forms.
- **Dynamic Pages**: Explore posts, view post details, and manage user profiles.
- **Context API**: State management for authentication and user data.
- **Reusable Components**: Navbar, forms, and other UI elements.

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB

### Frontend
- React
- CSS Modules

## Getting Started

### Prerequisites
- Node.js installed on your system.
- MongoDB instance running locally or in the cloud.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kashshaf-Labib/tutor-bridge.git
   ```

2. Navigate to the project directory:
   ```bash
   cd tutor-bridge
   ```

3. Install dependencies for both backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

4. Set up environment variables for the backend in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Start the development servers:
   ```bash
   cd backend
   npm run dev
   cd ../frontend
   npm start
   ```

### Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

### License
This project is licensed under the MIT License.
