# RadioSzkola Project

RadioSzkola is a web application for the school radio station at II Liceum Ogólnokształcące in Racibórz. The platform allows users to view currently playing music, recently played tracks, and features user authentication for administrative features.

## Features

- Real-time display of currently playing tracks via Spotify integration
- History of recently played music
- User authentication system with registration codes
- Admin panel for managing registration codes and Spotify connections
- Responsive design that works on both mobile and desktop devices

## Technology Stack

- **Frontend**: Vue.js, Nuxt 3, Tailwind CSS
- **Backend**: Nuxt server routes
- **Database**: SQLite with Drizzle ORM
- **Authentication**: Custom implementation with session management
- **External APIs**: Spotify Web API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env`:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=your_redirect_uri
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Admin Access

Access to admin features requires registration with a valid admin code. Contact the system administrator to obtain an admin registration code.

## Project Structure

- `/components`: Vue components
- `/layouts`: Page layouts
- `/pages`: Application routes
- `/composables`: Shared Vue composables
- `/server`: Backend API routes and database schema
- `/utils`: Utility functions and type definitions

## Deployment

The application is designed to be deployed on Vercel or similar platforms.

## License

MIT

## Contact

For questions or support, contact the development team at lo2radiowezel@proton.me.
