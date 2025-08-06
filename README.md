# 🎨 MoodBoard Lite

A full-stack web application where users can express their daily mood through emojis, images, colors, and notes. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- User registration and login
- Protected routes
- Secure password hashing

### 📝 MoodBoard Creation
- **Emojis**: Select multiple emojis to express your mood
- **Images/GIFs**: Add images or GIFs via URL links
- **Color Themes**: Choose from predefined colors or custom color picker
- **Notes**: Write short notes (max 200 characters)
- **Daily Limit**: Only one moodboard per user per day

### 📊 MoodBoard Viewing
- View today's moodboard
- Browse past moodboards in a timeline format
- Responsive design for mobile and desktop

### 🎨 UI/UX Features
- Modern, beautiful interface with gradients
- Smooth animations and transitions
- Mobile-responsive design
- Emoji picker integration
- Color picker with presets

## 🚀 Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Emoji-mart** - Emoji picker
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MoodBoard
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In the server directory
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/moodboard_lite
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start the server (from server directory)
   npm run dev
   
   # Start the client (from client directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create MoodBoard**: Click "Create Today's MoodBoard" to express your mood
3. **Add Elements**:
   - Select emojis using the emoji picker
   - Add an image or GIF URL
   - Choose a color theme
   - Write a short note about your mood
4. **View History**: Browse your past moodboards in the timeline

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### MoodBoards
- `GET /api/moodboards` - Get user's moodboards (today + past)
- `POST /api/moodboards` - Create new moodboard
- `GET /api/moodboards/:id` - Get specific moodboard
- `PUT /api/moodboards/:id` - Update moodboard (today only)
- `DELETE /api/moodboards/:id` - Delete moodboard (today only)

## 🎯 Project Structure

```
MoodBoard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Authentication context   
│   └── public/            # Static files
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── index.js          # Server entry point
└── README.md             # This file
```

## 🎨 Screenshots

### Login/Register
<img width="1110" height="602" alt="Screenshot 2025-08-06 203607" src="https://github.com/user-attachments/assets/e88d2382-d492-4d34-b1ee-d23bd3f84c10" />
<img width="1050" height="599" alt="Screenshot 2025-08-06 204115" src="https://github.com/user-attachments/assets/721a4386-40ed-4d8b-91da-837a5b924187" />

### Create MoodBoard 
<img width="471" height="530" alt="Screenshot 2025-08-06 200449" src="https://github.com/user-attachments/assets/12d84a7e-a1b2-4c38-b03b-3f2f813d90c5" />

### Dashboaard
<img width="1354" height="603" alt="Screenshot 2025-08-06 200425" src="https://github.com/user-attachments/assets/cf2f4d23-14ac-4af4-9e69-fcadb39846c1" />



## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting platform

### Backend (Render/Railway)
1. Set environment variables
2. Deploy the server directory
3. Update frontend API URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 👨‍💻 Author

Created as a full-stack developer assignment showcasing MERN stack skills.

---


**Note**: This is a demonstration project. For production use, ensure proper security measures, environment variables, and database optimization. 

