# ApniSec - Proactive Cybersecurity Platform

This is a full-stack Next.js application designed as a comprehensive platform for cybersecurity management. It features a secure user authentication system, a detailed project dashboard for data visualization, and a complete issue tracking system. The backend is built with a class-based architecture for clear separation of concerns, and it integrates with MongoDB for data persistence and Resend for email notifications.

## Deployed Application URL

You can access the live application here: [**Your Deployed URL**](https://apnisec007.netlify.app/) _(https://apnisec007.netlify.app/)_

## Key Features

- **Secure User Authentication**: Complete flow for user registration, login, and logout using JWT for session management.
- **Password Management**: Secure "Forgot Password" and "Reset Password" functionality with unique, expiring tokens sent via email.
- **User Profile Management**: Users can view and update their personal and professional information.
- **Issue Tracking System**: Full CRUD (Create, Read, Update, Delete) functionality for managing security issues.
- **Advanced Issue Filtering**:
    - Filter issues by type (VAPT, Cloud Security, etc.).
    - Real-time search functionality to filter issues by title or description.
- **Interactive Dashboard**: A data-rich dashboard with charts and tables to visualize security posture, risks, and recent activities.
- **Email Notifications**: Integration with Resend for sending transactional emails for:
    - Welcome messages on registration.
    - Password reset links.
    - Confirmations for new issue creation.
    - Profile update notifications.
- **SEO Optimized Landing Page**: A marketing-focused home page with metadata and `alt` tags to improve search engine ranking.
- **Robust Backend Architecture**:
    - **Class-based**: All backend logic uses a strict, class-based architecture.
    - **Separation of Concerns**: Code is organized into Controllers (request handling), Services (business logic), and Repositories (data access).
- **Rate Limiting**: Protects API endpoints from abuse with an in-memory rate limiter.

## SEO Performance

The application is optimized for search engines, achieving high performance, accessibility, and SEO scores. Below are the Lighthouse scores for the live production deployment.

### Desktop Score & Mobile Score
![Desktop SEO Score](https://github.com/ArnavSingha/ApniSec/blob/main/seo.jpeg)

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/) using the `jose` library
- **Email Service**: [Resend](https://resend.com/)
- **Validation**: [Zod](https://zod.dev/) for form validation

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [MongoDB](https://www.mongodb.com/try/download/community) instance (local or a cloud service like MongoDB Atlas)
- A [Resend](https://resend.com/) account for sending emails

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file `.env.example` to a new file named `.env` and fill in the required values.

```bash
cp .env.example .env
```

Now, open the `.env` file and add your specific credentials.

**Important**: 
- For the `JWT_SECRET`, you should use a long, random, and secret string for security. You can generate one using `openssl rand -base64 32` in your terminal.
- For the `FROM_EMAIL`, you must use an email address from a domain you have verified in your Resend account. In Resend's sandbox mode, you can only send emails *to* the email address you signed up with.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Available Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for potential issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## Project Structure

The codebase is organized with a clear separation of concerns, primarily within the `src/` directory.

```
/src
├── app/                  # Next.js App Router: pages and layouts
│   ├── api/              # API route handlers
│   ├── dashboard/        # Protected dashboard pages
│   └── (public)/         # Public pages like login, register
├── components/           # Reusable React components (UI and custom)
├── hooks/                # Custom React hooks
├── lib/                  # Core backend logic, utilities, and services
│   ├── core/             # Core classes (ApiError, ApiResponse, Database)
│   ├── models/           # Mongoose schemas and TypeScript interfaces
│   ├── modules/          # Feature-specific backend modules (auth, issues)
│   │   ├── auth/
│   │   │   ├── AuthController.ts
│   │   │   ├── AuthService.ts
│   │   └── ...
│   ├── security/         # Security-related utilities (JWT, Rate Limiter)
│   └── services/         # Shared services (EmailService)
└── middleware.ts         # Next.js middleware for route protection
```

This project is now set up and ready for development and deployment.
