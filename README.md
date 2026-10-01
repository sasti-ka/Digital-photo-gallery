# Digital Photo Gallery

"Capture. Organize. Remember."

A complete, production-style full-stack Digital Photo Gallery web application built with the MERN stack and Cloudinary.

## Features

- **Authentication:** JWT-based user registration and login.
- **Photo Uploads:** Drag-and-drop uploads, Cloudinary integration.
- **Gallery UI:** Responsive masonry layout, dark mode, photo cards.
- **Albums:** Create and manage photo albums.
- **Favorites:** Like and favorite photos.
- **Search & Filters:** Powerful search by tags, titles, and categories.
- **Photo Viewer:** Lightbox-style fullscreen viewing.
- **Admin Dashboard:** Manage users, photos, and reports.
- **Responsive Design:** Looks great on desktop, tablet, and mobile.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Lucide React (Icons)
- Framer Motion

**Backend:**
- Node.js
- Express.js
- MongoDB / Mongoose
- Cloudinary (Image storage)
- JWT (Authentication)
- bcrypt (Password hashing)

## Folder Structure

```
digital-photo-gallery/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Application routes/pages
│   │   ├── services/       # API integration
│   │   └── index.css       # Tailwind entry
│   └── package.json
├── server/                 # Backend Node/Express API
│   ├── config/             # DB & Cloudinary configs
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & Multer middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   └── package.json
└── README.md
```

## Installation & Setup

1. **Clone the repository** (if applicable) and navigate to the root directory.

2. **MongoDB Setup:**
   Ensure you have a local MongoDB instance running on `mongodb://127.0.0.1:27017` or use a MongoDB Atlas URI.

3. **Environment Variables:**
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/digital-photo-gallery
   JWT_SECRET=your_jwt_secret_change_me
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   
   Create a `.env` file in the `/client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Install Dependencies:**
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

5. **Seed the Database (Optional):**
   ```bash
   cd server
   npm run data:import
   ```

6. **Run the Application:**
   Start the backend (from `/server`):
   ```bash
   npm run dev
   ```
   Start the frontend (from `/client`):
   ```bash
   npm run dev
   ```

## Demo Credentials (Seed Data)
If you ran the seeder script, you can log in with:
- **Admin:** `admin@photovault.demo` / `password123`
- **User:** `user1@photovault.demo` / `password123`

## API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/photos` - Upload a new photo
- `GET /api/photos` - Get all photos (with search/filter query params)
- `GET /api/photos/:id` - Get single photo details
- `PUT /api/photos/:id` - Update photo details
- `DELETE /api/photos/:id` - Delete photo
- `POST /api/photos/:id/like` - Like/Unlike photo
- `POST /api/photos/:id/favorite` - Favorite/Unfavorite photo
- `POST /api/albums` - Create album
- `GET /api/albums` - Get albums
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/admin/users` - Get all users (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

## Deployment Instructions

1. **Frontend:** Build the Vite app using `npm run build` in the `/client` folder. Deploy the `dist` folder to Vercel or Netlify. Make sure to set `VITE_API_URL` to your production backend URL.
2. **Backend:** Deploy the `/server` folder to Render, Heroku, or DigitalOcean. Set up environment variables matching the `.env` template. Ensure MongoDB Atlas is configured to allow connections from your deployment IP.
