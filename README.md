## 🎨 Frontend (taskie-frontend)

**Tech Stack:** React 18, Vite, Tailwind CSS, React Router

### Features
- Modern React 18 with Hooks
- Vite for fast development and building
- Tailwind CSS for responsive UI
- React Router for client-side routing
- Context API for state management
- Protected routes with role-based access
- Real-time messaging interface

### Pages
- **Auth:** Login, Register, Role Selection
- **Requester:** Task creation, management, messaging
- **Tasker:** Task search, favorites, messaging
- **Admin:** Dashboard, user management
- **Shared:** Chat interface

### Setup
cd taskie-frontend
npm install
npm run dev       # Development server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build### Environment
Update API base URL in `src/utils/api.js` to match your backend URL.
