# AI Interview Agent Platform

A complete AI-powered interview preparation platform that helps students practice for college placements with personalized feedback and progress tracking.

## 🚀 Features

- **Firebase Authentication** - Secure email/password login and registration
- **Topic Selection** - Dynamic topic loading from Firestore database
- **AI Interview Simulation** - Real-time chat interface with OpenAI GPT-3.5
- **Instant Feedback** - AI-powered scoring and detailed feedback (0-10 scale)
- **Progress Analytics** - Charts showing performance by topic and over time
- **Responsive Design** - Modern UI with Tailwind CSS and smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Firebase SDK** for authentication and database
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express framework
- **OpenAI API** for question generation and feedback
- **Firebase Admin SDK** for authentication verification
- **CORS** and security middleware
- **Rate limiting** for API protection

### Database & Auth
- **Firebase Authentication** for user management
- **Firestore** for data storage
- **Real-time** updates and offline support

## 📦 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm run install:all
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Generate a service account key for backend
5. Get your web app config for frontend

### 3. Environment Variables

#### Frontend (.env)
```bash
cp frontend/.env.example frontend/.env
```

Fill in your Firebase config:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000
```

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
```

Fill in your credentials:
```
PORT=5000
OPENAI_API_KEY=your_openai_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
NODE_ENV=development
```

### 4. Seed Firestore Database

Import the sample data from `firestore-seed-data.json` into your Firestore:

1. Go to Firebase Console → Firestore Database
2. Create a collection called `topics`
3. Add documents with the data from the seed file

### 5. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

## 🏗️ Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── TopicSelection.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── firebase.js
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── routes/
│   │   └── interview.js
│   ├── firebaseAdmin.js
│   ├── server.js
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### POST `/api/question`
Generate interview question for a topic
```json
{
  "topic": "Java Programming"
}
```

### POST `/api/feedback`
Get AI feedback and score for an answer
```json
{
  "question": "Explain OOP concepts",
  "answer": "OOP has four main principles...",
  "topic": "Java Programming"
}
```

## 📊 Database Schema

### Firestore Collections

#### `topics/{topicId}`
```json
{
  "title": "Java Programming",
  "description": "Core Java concepts...",
  "color": "bg-gradient-to-br from-orange-500 to-red-600",
  "questionCount": 15,
  "difficulty": "Intermediate"
}
```

#### `users/{userId}`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "timestamp",
  "totalInterviews": 5,
  "averageScore": 7.2
}
```

#### `users/{userId}/interviews/{interviewId}`
```json
{
  "question": "Explain polymorphism in Java",
  "answer": "Polymorphism allows...",
  "feedback": "Good explanation but...",
  "score": 8,
  "topic": "Java Programming",
  "topicId": "java",
  "timestamp": "timestamp"
}
```

## 🚀 Deployment

### Frontend (Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Backend (Render/Heroku)
1. Push backend code to GitHub
2. Connect to Render/Heroku
3. Set environment variables
4. Deploy

## 🔐 Security Features

- Firebase Authentication with secure token verification
- Rate limiting to prevent API abuse
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- Helmet.js for security headers
- Environment variable protection

## 🎯 Key Features Implemented

✅ **Authentication**: Complete Firebase auth with error handling  
✅ **Topic Selection**: Dynamic topic loading from Firestore  
✅ **AI Interview**: Real-time chat with OpenAI integration  
✅ **Feedback System**: Instant scoring and detailed feedback  
✅ **Progress Tracking**: Charts and analytics dashboard  
✅ **Responsive Design**: Mobile-friendly with modern UI  
✅ **Error Handling**: Comprehensive error management  
✅ **Security**: Protected routes and API security  

## 📈 Future Enhancements

- Voice recording and speech-to-text
- Video interview simulation
- Advanced analytics and ML insights
- Company-specific interview preparation
- Peer comparison and leaderboards
- Integration with job portals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.