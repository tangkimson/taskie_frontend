# 🎨 Taskie Frontend

Modern, responsive frontend UI for Taskie - A task marketplace platform built with React, Vite, and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **State Management:** React Context API

## ✨ Features

### 🔐 Authentication
- User registration (email or phone)
- Login system
- Role selection (Requester or Tasker)
- JWT token management
- Protected routes

### 👤 For Requesters
- Create new tasks with image upload
- Set task details (title, description, category, location, price, deadline)
- Upload payment proof
- View and manage own tasks
- Edit task details
- Mark tasks as completed
- Message taskers
- View message history
- Profile management

### 🔍 For Taskers
- Search tasks with advanced filters
  - Category filter
  - Location filter (Province + Ward)
  - Price range filter
  - Sort by latest/oldest/price
- View task details
- Save favorite tasks
- Message requesters
- View message history
- Profile management with proof of experience

### 👑 For Admins
- Dashboard with system statistics
- View all users
- View all tasks
- Monitor system activity

### 🎨 UI/UX Features
- Responsive design (mobile, tablet, desktop)
- Modern, clean interface
- Loading states
- Error handling with user-friendly messages
- Success notifications
- Confirmation dialogs
- Image preview
- Back navigation
- Smooth transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tangkimson/taskie-frontend.git
cd taskie-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

5. **Build for production**
```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📁 Project Structure

```
taskie-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── BackButton.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── SuccessMessage.jsx
│   │   └── TaskCard.jsx
│   ├── context/         # React Context
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminAccount.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ChooseRole.jsx
│   │   ├── requester/
│   │   │   ├── RequesterTasks.jsx
│   │   │   ├── CreateTask.jsx
│   │   │   ├── EditTask.jsx
│   │   │   ├── RequesterTaskDetail.jsx
│   │   │   ├── RequesterProfile.jsx
│   │   │   └── RequesterMessageHistory.jsx
│   │   ├── tasker/
│   │   │   ├── TaskerSearch.jsx
│   │   │   ├── TaskerTaskDetail.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── MessageHistory.jsx
│   │   │   └── TaskerProfile.jsx
│   │   └── shared/
│   │       └── Chat.jsx
│   ├── utils/           # Utilities
│   │   └── api.js       # Axios configuration
│   ├── App.jsx          # Main app component with routes
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Key Components

### Layout Components
- **Layout** - Main layout wrapper with navbar
- **Navbar** - Navigation bar with role-based menu
- **BackButton** - Reusable back navigation button
- **LoadingSpinner** - Loading indicator
- **ErrorMessage** - Error display component
- **SuccessMessage** - Success notification component
- **ConfirmDialog** - Confirmation modal

### Feature Components
- **TaskCard** - Task display card for listings
- **AuthContext** - Global authentication state

## 🔐 Authentication Flow

1. User registers with email/phone
2. User logs in → receives JWT token
3. Token stored in localStorage
4. User selects role (Requester/Tasker)
5. Role determines available features
6. Token included in API requests via Axios interceptor
7. Auto-logout on token expiration

## 🎯 Routes Structure

```
/                          - Login page
/register                  - Registration page
/auth/choose-role          - Role selection

/requester/tasks           - Requester task list
/requester/tasks/create    - Create new task
/requester/tasks/:id       - Task details
/requester/tasks/:id/edit  - Edit task
/requester/profile         - Requester profile
/requester/messages        - Message history

/tasker/search             - Task search
/tasker/tasks/:id          - Task details
/tasker/favorites          - Saved tasks
/tasker/messages           - Message history
/tasker/profile            - Tasker profile

/shared/chat/:taskId       - Chat interface

/admin/dashboard           - Admin dashboard
/admin/account             - Admin account settings
```

## 🌈 Styling

This project uses Tailwind CSS for styling with custom configurations:

- Responsive breakpoints (sm, md, lg, xl)
- Custom color palette
- Utility-first approach
- Component-specific styles

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## 🌐 Deployment

### Deploy to Render.com

1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Configure environment variables
4. Set build command: `npm run build`
5. Set publish directory: `dist`

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build: `npm run build`
2. Drag and drop `dist/` folder to Netlify
3. Or connect GitHub repository

## 🧪 Default Test Accounts

After backend seeding:
- **Admin:** admin@taskie.com / admin123

Create your own accounts for Requester and Tasker roles!

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For any questions or support, please contact: tangkimsontks@gmail.com

---

**Built with ❤️ using React + Vite + Tailwind CSS**
