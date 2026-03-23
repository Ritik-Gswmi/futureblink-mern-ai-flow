# FutureBlink MERN AI Flow

A simple **MERN stack application** that demonstrates connecting multiple technologies together.

Users can type a prompt inside a **React Flow input node**, click **Run Flow**, and see the AI-generated response appear in the connected **Result node**. The prompt and response can optionally be **saved to MongoDB**.

This project was built as part of the **FutureBlink Developer Task**.

---

# 🚀 Live Demo

Frontend:
https://futureblink-mern-ai-flow.vercel.app

Backend API:
https://futureblink-mern-ai-flow.onrender.com

---

# 📸 Screenshots

![Screenshot-01](./frontend/src/assets/Screenshot-01.png)

![Screenshot-02](./frontend/src/assets/Screenshot-02.png)

---

# 🧠 Features

* React Flow visualization with connected nodes
* Prompt input node
* AI response result node
* Run Flow button to trigger AI request
* Backend API integration
* AI response generation using **OpenRouter API**
* Save prompt and response to **MongoDB**
* View previously saved runs
* Secure API key handling through backend

---

# 🏗 Tech Stack

**Frontend**

* React
* React Flow
* Tailwind CSS
* Vite

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB (Atlas)

**AI Integration**

* OpenRouter API

---

# ⚙️ Architecture

User Flow:

```
React (React Flow UI)
        │
        ▼
Express API (/api/ask-ai)
        │
        ▼
OpenRouter AI API
        │
        ▼
MongoDB Atlas (optional save)
```

---

# 🔧 Prerequisites

* Node.js 18+ (tested with Node 20)
* MongoDB Atlas account
* OpenRouter API key

---

# 🗄 MongoDB Atlas Setup (Recommended)

1. Create a cluster on MongoDB Atlas.
2. Create a database user.
3. In **Network Access**, allow your IP (or `0.0.0.0/0` for testing).
4. Copy the connection string.
5. Add it to your backend `.env`.

Example:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-ai-flow
```

---

# 🖥 Backend Setup

```
cd backend
cp .env.example .env
```

Edit `.env`:

```
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free (assignment) # or google/gemini-2.0-flash-lite-preview-02-05:free (assignment) or openrouter/free (fallback)
OPENROUTER_FALLBACK_MODEL=openrouter/free (used if your chosen model has no endpoints)
OPENROUTER_MAX_TOKENS=1024 (smaller = faster)
OPENROUTER_TEMPERATURE=0.4
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Note: Free model availability changes. If you see `No endpoints found` (or you hit daily free-tier rate limits), set `OPENROUTER_MODEL=openrouter/free`.

Run backend:

```
npm install
npm start
```

Backend runs at:

```
http://localhost:5000
```

---

# 🌐 Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

The frontend proxies API requests to the backend.

For production, set `VITE_API_URL` (see `frontend/.env.example`) to your deployed backend base URL (for example: `https://mern-ai-flow-backend.onrender.com`).

---

# 🎨 Styling

This project uses **Tailwind CSS** for styling.

Configuration files:

```
frontend/tailwind.config.js
frontend/postcss.config.js
```

---

# 📡 API Endpoints

### Generate AI Response

```
POST /api/ask-ai
```

Request:

```
{
  "prompt": "What is the capital of France?"
}
```

Response:

```
{
  "answer": "The capital of France is Paris."
}
```

---

### Save Prompt & Response

```
POST /api/runs
```

Request:

```
{
  "prompt": "...",
  "answer": "..."
}
```

---

### Get Previous Runs

```
GET /api/runs
```

Returns the last **50 saved records**.

---

# 🚀 Deployment

Recommended deployment setup:

| Service  | Platform      |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |

Example:

```
Frontend → https://app.vercel.app
Backend → https://api.onrender.com
```

---

# 📹 Demo Video

A short demonstration video showing:

* Prompt input
* Running the AI flow
* Displaying the response
* Saving to MongoDB

(Video link here)

---

# 📄 License

This project was created for the **FutureBlink Developer Assignment**.
