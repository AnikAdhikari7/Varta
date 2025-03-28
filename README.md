# Varta

### Chat Karein, Varta Karein – "Chat and Converse" 🚀💬

**Varta** is a full-stack real-time chatting web application that lets users sign up, log in, update their avatars, and chat in real time using Socket.IO. The application features a modern React frontend with Tailwind CSS styling and a robust Node.js/Express backend powered by MongoDB and Socket.IO.

---

## Table of Contents

- [Features ✨](#features-)
- [Tech Stack 🛠️](#tech-stack-)
- [Installation & Setup 🚀](#installation--setup-)
- [Usage 📱](#usage-)
- [API Endpoints 🔌](#api-endpoints-)
- [Contributing 🤝](#contributing-)
- [License 📜](#license-)

---

## Features ✨

- **Real-Time Chat:** Engage in real-time conversations with support for continuous online status updates.
- **User Authentication:** Secure signup, login, and logout functionalities using JWT and secure password hashing (bcrypt).
- **Avatar Upload:** Customize your profile by uploading and updating avatars (integrated with Cloudinary).
- **Socket.IO:** Real-time communication with a fully integrated Socket.IO setup to track online users.
- **Error Handling:** Custom error handling on both the backend and frontend ensuring smooth user experience.
- **Responsive Design:** A clean and responsive UI built with React, TailwindCSS, and daisyUI.

---

## Tech Stack 🛠️

**Frontend:**

- React ⚛️
- Vite (frontend build tool)
- Tailwind CSS & daisyUI 🎨
- Zustand (State Management)
- Axios (API Requests)
- Socket.IO Client

**Backend:**

- Node.js & Express 🌐
- MongoDB (with Mongoose ODM)
- Socket.IO Server
- JWT for Authentication 🔑
- Cloudinary for Media Storage ☁️
- Winston & Morgan for logging

---

## Installation & Setup 🚀

### Backend

1. **Clone the repository:**

    ```bash
    git clone https://github.com/AnikAdhikari7/Varta.git
    cd Varta/backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**

    Create a `.env` file in the `backend` folder with the following variables (adjust according to your setup):

    ```properties
    PORT=8080
    MONGODB_URI=your_mongodb_connection_uri
    CORS_ORIGIN=http://localhost:5173
    JWT_TOKEN_SECRET=your_super_secure_secret
    JWT_TOKEN_EXPIRY=7d
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    NODE_ENV=development
    ```

4. **Start the backend server:**
    ```bash
    npm run dev
    ```

### Frontend

1. **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**

    Create a `.env` file in the `frontend` folder:

    ```properties
    VITE_BACKEND_BASE_URL=http://localhost:8080/api/v1
    VITE_SOCKET_URL=http://localhost:8080
    ```

4. **Start the development server:**
    ```bash
    npm run dev
    ```

---

## Usage 📱

- **Authentication:** Users can sign up and log in. The authentication tokens are managed via cookies and local state.
- **Real-Time Chat:** Once authenticated, Socket.IO connects automatically to handle messaging and online user tracking.
- **Profile Management:** Users can update their avatars in real-time without page refreshes.

---

## API Endpoints 🔌

### Auth Routes

- **POST /auth/signup:** Create a new user account.
- **POST /auth/login:** Authenticate user and start a session.
- **GET /auth/logout:** End user session.
- **GET /auth/user:** Retrieve authenticated user details.
- **PUT /auth/update-avatar:** Upload and update user avatar.

### Message Routes

- **Various endpoints** for managing messages (check the source code for details).

---

## Keeping the App Awake 🔄

To prevent the application from sleeping on Render (or similar hosts), a GitHub Actions workflow is set up to send an HTTP request every 10 minutes. This workflow is defined in `.github/workflows/keep-alive.yml`.

---

## Contributing 🤝

Contributions are welcome! Feel free to fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## License 📜

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

Happy Coding! 😃✨
