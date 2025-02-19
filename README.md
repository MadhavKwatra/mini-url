# Mini-URL Backend

A simple **URL shortener** backend built using **Node.js**, **Express**, and **MongoDB** with **TypeScript**. It will support authentication, analytics, and link tracking.

---

## 🚀 Features

- **URL Shortening**: Generate short URLs for long URLs.
- **User Authentication**: Sign up & log in using email and third-party providers.
- **Analytics Tracking**: Log visits, including country, state, city, IP, and user agent.
- **RESTful API**: Well-structured and documented API.

---

## 🏗 Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, OAuth (Planned)
- **Geolocation**: geoip-lite

---

## 📂 Project Structure

```
mini-url
│── /dist                 # Compiled TypeScript files
│── /node_modules         # Dependencies
│── /src
│   ├── /config           # Configuration files
│   ├── /controllers      # API Controllers
│   ├── /models           # Database Models
│   ├── /routes           # Route Handlers
│   ├── /services         # Business Logic
│   ├── /middlewares      # Middleware (Auth, Logging, etc.)
│   ├── /utils            # Helper functions, logger, etc.
│   ├── app.ts            # Express app setup
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
├── .gitignore            # Git ignore file
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies & scripts
├── README.md             # Documentation
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```sh
git clone https://github.com/MadhavKwatra/mini-url.git
cd mini-url
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env.development` file in the root directory and add:

```env
MONGO_URI=your_mongodb_connection_string
PORT=your_port
```

### 4️⃣ Run Development Server

```sh
npm run dev
```

---

## 📌 API Endpoints

### 🔹 URL Shortening

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| POST   | `/api/shorten` | Shorten a new URL        |
| GET    | `/:shortId`    | Redirect to original URL |
| GET    | `/api/urls`    | Get all URLs             |

### 🔹 Analytics

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/api/analytics/:id` | Get visit analytics for a short URL |

### 🔹 Authentication (Planned)

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | User registration |
| POST   | `/api/auth/login`    | User login        |

---

## 📌 TODOs

### ✨ Features to Implement

- [ ] Add authentication
  - [ ] Custom email and password
  - [ ] Third parties
- [ ] Custom SLugs
- [ ] Add analytics for each url
- [ ] Delete shortened url
- [ ] Dashboard apis

### 🔧 Code Enhancements

- [ ] Add proper error handling middleware
- [ ] Implement logging using `winston`
- [ ] Setup ESLint and Prettier for code quality

---

## 📜 License

This project is licensed under the **MIT License**.

<!-- Is it ok to use this? -->

---

## 💡 Contributing

Feel free to fork this repository and submit a pull request! 🚀
