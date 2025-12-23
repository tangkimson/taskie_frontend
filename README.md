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
npm run preview   # Preview production build### Environment Variables

The app uses `VITE_API_URL` environment variable for the backend API URL.

**For local development:**
- Create `.env.local` file (already created, ignored by git):
  ```env
  VITE_API_URL=http://localhost:5000
  ```

**For production:**
- Set `VITE_API_URL` in your hosting platform (Vercel)
- Example: `https://taskie-backend-kh69.onrender.com`

**Note:** The code automatically uses `VITE_API_URL` from environment variables. If not set, it defaults to `http://localhost:5000`.
