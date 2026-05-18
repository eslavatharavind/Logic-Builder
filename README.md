# LogicBuilder – AI Logical Thinking Trainer

<p align="center">
  <img src="frontend/public/brain.svg" width="120" alt="LogicBuilder Logo" />
</p>

**LogicBuilder** is an AI-powered logical thinking trainer designed for software engineers and aspiring developers. Instead of letting you immediately jump into writing code, LogicBuilder forces you to slow down, decompose complex algorithmic problems into plain English, answer critical thinking questions, and build a logical framework—all before you write a single line of code.

By separating the **thinking** from the **typing**, LogicBuilder trains you to approach system design and algorithms like a senior software engineer.

---

## 🌟 Key Features

1. **The 8-Step Pipeline**: A structured workflow that guides you from problem comprehension to a final, evaluated solution.
2. **AI Logic Coach**: Instead of giving away answers, the AI evaluates the *quality of your reasoning* and points out gaps in your logic.
3. **Retrieval-Augmented Generation (RAG)**: The backend uses ChromaDB and SentenceTransformers to find similar algorithmic patterns and provide better context for the AI coach.
4. **Adaptive Theming**: A beautifully designed, glassmorphism UI with seamless Light and Dark modes.
5. **Practice & Guided Modes**: Choose between strict guided pipelines or an open-ended practice sandbox.
6. **Persistence**: Secure user authentication (Supabase) and attempt history tracking via SQLite & SQLAlchemy.

---

## 🛠️ Tech Stack

**Frontend**
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS (Custom Glassmorphism)
- **Icons**: Lucide-React
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router DOM

**Backend**
- **Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **AI Integration**: Google Gemini API via `google-genai`
- **Vector DB**: ChromaDB for RAG implementation
- **Embeddings**: `sentence-transformers` (all-MiniLM-L6-v2)

**Authentication**
- **Provider**: Supabase (Email/Password & Google OAuth)

---

## 📂 Project Structure

```text
Logic-Builder/
├── backend/                  # FastAPI Backend Application
│   ├── main.py               # Application entry point & API routes
│   ├── database.py           # SQLAlchemy setup & session management
│   ├── models.py             # Database schemas (Users, Problems, Attempts)
│   ├── logic_coach.py        # Core AI evaluation and interaction logic
│   ├── vector_db.py          # ChromaDB integration for algorithmic context
│   ├── generate_problems.py  # Script to populate the DB with sample problems
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # React Vite Frontend Application
    ├── src/
    │   ├── components/       # Reusable UI components (Navbar, Editor, Pipeline)
    │   ├── pages/            # Application views (Landing, Auth, Dashboard, Guided)
    │   ├── services/         # API clients (Backend calls, Supabase client)
    │   ├── store/            # Zustand global state (Theme, Auth, Pipeline state)
    │   ├── App.tsx           # Main application router
    │   └── index.css         # Global design tokens and glassmorphism styles
    ├── index.html            # HTML Entry point
    └── vite.config.ts        # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher (for the frontend)
- **Python**: 3.9 or higher (for the backend)
- **Supabase Account**: For authentication credentials
- **Gemini API Key**: For the AI logic coach

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/logic-builder.git
cd logic-builder
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and set up your environment variables.
```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Run the backend development server
python -m uvicorn main:app --reload
```
*The backend will be available at `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and set up your environment variables.
```bash
cd frontend

# Install dependencies
npm install

# Create a .env file with your Supabase credentials and Backend URL
echo "VITE_SUPABASE_URL=your_supabase_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env
echo "VITE_API_URL=http://localhost:8000" >> .env

# Run the frontend development server
npm run dev
```
*The frontend will be available at `http://localhost:5173`*

---

## 🧠 Why "Think Before You Code"?

The most common mistake junior developers make is immediately opening their IDE and typing out code the second they encounter a problem. This leads to spaghetti code, endless debugging loops, and fundamentally flawed architectures. 

By forcing a structured reasoning process (Explain -> Question -> Feedback -> Steps -> Skeleton -> Code -> Evaluate), LogicBuilder ensures you deeply understand the problem domain before committing to syntax.

---

## 📝 License

This project is licensed under the MIT License.
