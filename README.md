🤖 KP Interview — AI-Powered Interview Preparation Platform

KP Interview is a full-stack AI-powered Interview Preparation Platform designed to help students and job seekers prepare for interviews, evaluate their performance, and improve their career readiness.

The platform combines HR interviews, technical interviews, aptitude tests, AI-powered mock interviews, resume analysis, performance analytics, PDF reports, and achievement certificates into a single application.

🌐 Live Demo

Live Website: https://kp-interviewai.netlify.app

💻 Source Code

GitHub Repository: https://github.com/Tatakarthesha/INTERVIEWAI

---

✨ Features

🔐 Authentication

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt.js
- Personalized user dashboard
- Secure authentication flow

📊 Dashboard

The dashboard provides an overview of the user's interview performance, including:

- Total interviews attempted
- Average score
- Best score
- AI evaluation statistics
- Interview preparation options
- Domain selection

Supported domains can include:

- Computer Science & Engineering
- Artificial Intelligence / Machine Learning
- Data Science
- Civil Engineering
- Mechanical Engineering
- And other domains

---

🎯 Interview Preparation

KP Interview provides four different interview preparation modes.

1. 👔 HR Interview

Users can practice common HR interview questions and provide descriptive answers.

After completing the interview, users can review their attempted answers on the result page.

2. 💻 Technical Interview

Users receive domain-specific technical questions based on their selected field.

Features include:

- Domain-specific questions
- Descriptive answers
- Answer review
- Interview result analysis

3. 🧠 Aptitude Round

The aptitude round contains multiple-choice questions.

After submission, users can see:

- Selected answers
- Correct answers
- Correct/incorrect status
- Instant results

4. 🤖 AI Mock Interview

The AI Mock Interview is the main AI-powered feature of KP Interview.

Users answer five interview questions in descriptive format. Their responses are evaluated using the Google Gemini AI API.

The AI evaluates:

- Communication
- Technical Knowledge
- Confidence
- Overall Performance

The system also provides personalized AI-generated suggestions for improvement.

---

📈 AI Mock Interview Evaluation

After completing the AI Mock Interview, users receive a detailed evaluation containing:

- Overall score out of 10
- Communication score out of 5
- Technical Knowledge score out of 5
- Confidence score out of 5
- Overall performance rating
- Question-wise analysis
- User's answers
- Individual evaluation scores
- AI-generated improvement suggestions

Users can also download their complete interview evaluation as a PDF report.

---

🏆 Certificate Generation

After completing an AI Mock Interview, users can generate a Certificate of Achievement.

The certificate includes:

- User's name
- Selected domain
- Overall interview score
- Grade
- Performance badge
- Issue/completion date
- Unique certificate ID
- KP Interview branding
- Verification details

Performance Grading

Score| Grade| Performance
9.0 – 10.0| A+| Excellent
8.0 – 8.9| A| Very Good
7.0 – 7.9| B+| Good
6.0 – 6.9| B| Satisfactory
Below 6.0| C| Needs Improvement

Certificates can be generated and downloaded directly from the platform.

---

📄 Resume Analyzer

KP Interview also includes a Resume Analyzer under Career Tools.

Users can upload their resume and receive an AI-powered analysis including:

- ATS score
- Resume score
- Strengths
- Weaknesses
- Missing skills
- Personalized improvement suggestions

This helps users understand how their resume can be improved for job applications and ATS systems.

---

📥 Reports

Users can download their AI interview evaluation as a PDF report.

The report provides a complete record of the interview performance and AI-generated feedback.

---

🛠️ Tech Stack

Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- Axios

Backend

- Node.js
- Express.js

Database

- MongoDB
- Mongoose

AI

- Google Gemini AI API

Authentication & Security

- JSON Web Tokens (JWT)
- bcrypt.js

Deployment

- Frontend: Netlify
- Backend: Render

---

🏗️ Project Structure

INTERVIEWAI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md

---

🔄 Application Flow

User
 │
 ▼
KP Interview Frontend
 │
 │ API Requests
 ▼
Node.js + Express.js Backend
 │
 ├──────────────► MongoDB
 │
 └──────────────► Google Gemini AI
                         │
                         ▼
                  AI Evaluation
                         │
                         ▼
              Interview Results
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
        PDF Report             Certificate

---

🚀 Getting Started

Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB
- Git

You will also need a Google Gemini API key for the AI-powered features.

---

1. Clone the Repository

git clone https://github.com/Tatakarthesha/INTERVIEWAI.git

cd INTERVIEWAI

---

2. Setup the Backend

cd backend

npm install

Create a ".env" file inside the "backend" folder and configure the required environment variables.

Example:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Then start the backend:

npm start

---

3. Setup the Frontend

Open a new terminal:

cd frontend

npm install

Configure the frontend environment variables according to your project setup.

Then start the development server:

npm run dev

The application will be available through the local development URL provided by Vite.

---

🔑 Environment Variables

Do not commit API keys, database credentials, JWT secrets, or other sensitive information to GitHub.

Use ".env" files for private configuration and make sure they are included in ".gitignore".

---

🌍 Deployment

The application uses a separate frontend and backend deployment architecture:

Frontend → Netlify
Backend  → Render
Database → MongoDB
AI       → Google Gemini API

The public-facing application is available through the Netlify URL:

https://kp-interviewai.netlify.app

The frontend communicates with the deployed backend through API requests.

---

🎯 Project Goals

KP Interview was developed to provide students and job seekers with an accessible platform where they can:

- Practice different interview formats
- Improve interview confidence
- Receive AI-powered feedback
- Identify areas for improvement
- Analyze their resumes
- Track interview performance
- Generate interview reports
- Earn achievement certificates

---

🔮 Future Improvements

Possible future enhancements include:

- Voice-based AI interviews
- Real-time speech analysis
- Facial expression and confidence analysis
- More domain-specific interview questions
- Advanced interview analytics
- Interview history comparison
- Job-specific interview preparation
- Resume-to-job-description matching
- Improved certificate verification

---

👨‍💻 Developer

Tatakarthesha

🔗 Project Links

🌐 Live Demo:
https://kp-interviewai.netlify.app

💻 GitHub:
https://github.com/Tatakarthesha/INTERVIEWAI

---

⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

Feedback and suggestions are always welcome!

---

KP Interview — Prepare. Practice. Improve. Succeed. 🚀
