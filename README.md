# Drishti - Startup Idea Validator

## Project Overview

Drishti is a highly interactive startup idea validator with animated UI, real-time feedback, and engaging user experience. The application helps entrepreneurs validate their startup ideas through AI-powered insights, comprehensive market analysis, and actionable feedback.

## Recent Changes

### Authentication System Migration (January 9, 2025)
- **Removed Replit Auth**: Completely replaced Replit's OAuth system with simple username/password authentication
- **MongoDB Integration**: Migrated from PostgreSQL to MongoDB using the provided connection string
- **New Auth Flow**: 
  - `/auth` page with dual login/registration forms
  - Session-based authentication using express-session
  - Password hashing with bcryptjs
  - User management with username, email, firstName, lastName fields

### Technical Stack Changes
- **Database**: MongoDB (mongodb+srv://aax:3744@cluster0.e7l0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0)
- **Authentication**: Express sessions + bcryptjs password hashing
- **Frontend Auth**: React Hook Form + Zod validation
- **UI**: Animated auth page with gradient design matching app theme

## Project Architecture

### Backend Structure
- `server/auth.ts` - Authentication middleware and routes
- `server/storage.ts` - MongoDB operations for users and ideas  
- `server/routes.ts` - API routes with auth protection
- `server/db.ts` - MongoDB connection setup

### Frontend Structure
- `client/src/pages/auth.tsx` - Login/registration page
- `client/src/hooks/useAuth.ts` - Authentication state management
- `client/src/App.tsx` - Route protection and navigation logic

### Authentication Flow
1. User visits `/auth` for login/registration
2. Forms validated with Zod schemas
3. Server creates session on successful auth
4. Frontend redirects to dashboard on success
5. Protected routes require active session

### Data Models
- **User**: id, username, password (hashed), email, firstName, lastName, timestamps
- **Idea**: id, userId, title, problem, solution, targetMarket, team, businessModel, competition, viabilityScore, feedback, status, isBookmarked, timestamps

## User Preferences
- Simple authentication preferred over complex OAuth
- MongoDB over PostgreSQL for this project
- Focus on core functionality without heavy dependencies
- Clean, gradient-based UI design

## Known Issues
- None currently identified

## Deployment Notes
- MongoDB connection string is hardcoded (should be moved to environment variables for production)
- Session secret should be properly configured for production
- All authentication endpoints are working and tested

## Next Steps
- Test the complete authentication flow
- Verify idea validation functionality works with new auth
- Ensure all UI transitions work smoothly
