# Startup Idea Validator

## Overview

Drishti is a full-stack web application that allows entrepreneurs to evaluate their startup ideas through a comprehensive assessment system. The platform collects detailed information about problems, solutions, target markets, business models, and competitive landscapes to calculate viability scores and provide actionable feedback. Users can create, manage, and analyze multiple startup ideas through an intuitive interface that guides them through a structured evaluation process.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Single-page application built with React 18 and TypeScript for type safety
- **Routing**: Client-side routing using Wouter for lightweight navigation
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible interface
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Animations**: Framer Motion for smooth transitions and interactive animations
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Node.js with Express**: RESTful API server using Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit authentication system with session-based auth using passport strategies
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **API Structure**: RESTful endpoints for CRUD operations on ideas and user management
- **Validation**: Zod schemas shared between frontend and backend for consistent validation

### Data Architecture
- **Database Schema**: PostgreSQL with tables for users, startup ideas, and sessions
- **ORM**: Drizzle ORM with TypeScript integration for database operations
- **Schema Validation**: Drizzle-zod integration for runtime validation
- **Migrations**: Database migrations managed through Drizzle Kit

### Development Architecture
- **Build System**: Vite for fast development and optimized production builds
- **Module System**: ES modules throughout the application
- **Path Aliases**: TypeScript path mapping for clean imports
- **Development Server**: Hot module replacement with Vite middleware integration

## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary database hosted on Neon serverless platform
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL adapter
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon

### Authentication
- **Replit Auth**: OAuth-based authentication system integrated with Replit platform
- **Passport.js**: Authentication middleware with OpenID Connect strategy
- **express-session**: Session management with PostgreSQL store

### UI & Styling
- **Radix UI**: Headless UI component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for smooth interactions

### Development Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **Vite**: Fast build tool with development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer