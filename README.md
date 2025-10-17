# **Frontend for Next.JS & Spring Boot OAuth System**

A modern OAuth 2.0 authentication demo application built with Next.js 15 and Spring Boot 3. 
This frontend showcases secure GitHub OAuth integration, protected routes, and seamless user authentication with JWT-based session management. 
The authentication logic if handled by the [backend server](https://github.com/mbeps/oauth-nextjs-springboot-backend) built using Spring Boot.

The application implements secure token storage using httpOnly cookies, preventing XSS attacks whilst maintaining session persistence. 
CORS is properly configured to enable secure cross-origin communication between the frontend and backend. 
Automatic token refresh mechanisms ensure uninterrupted user sessions without requiring re-authentication.

# Features

## Authentication and Authorisation
The application implements secure OAuth 2.0 authentication with comprehensive session management:
- Users can sign in using GitHub OAuth
- Users can log out securely
- Automatic token refresh maintains session continuity
- Protected routes redirect unauthorised users to login
- Client-side authentication state management

## Protected Routes
The application enforces route-level security:
- Dashboard is accessible only to authenticated users
- Middleware validates JWT tokens before granting access
- Automatic redirection to login for unauthorised access attempts
- Public routes remain accessible without authentication

## Protected Actions
Secure API interactions require authentication:
- Users can perform authenticated actions on protected endpoints
- Real-time feedback via toast notifications
- Error handling for unauthorised action attempts
- Data fetching from protected backend resources

## User Profile
Authenticated users can view their profile information:
- Display GitHub profile details
- View user avatar and username
- Access user ID and email information

# Requirements
These are the requirements needed to run the project:
- Node.JS 22 LTS or higher
- [Backend server configured and running](https://github.com/mbeps/oauth-nextjs-springboot-backend)

# Stack
These are the main technologies used in this project:

## Front-End
- [**TypeScript**](https://www.typescriptlang.org/): A strongly typed superset of JavaScript that enhances code quality and developer productivity through static type checking.
- [**Next.JS**](https://nextjs.org/): A React framework with App Router for building server-side rendered and statically generated web applications.
- [**React.JS**](https://react.dev/): A JavaScript library for building user interfaces with component-based architecture.
- [**Tailwind CSS**](https://tailwindcss.com/): A utility-first CSS framework for rapidly building custom user interfaces.
- [**Shadcn UI**](https://ui.shadcn.com/): A collection of accessible and customisable React components built with Radix UI and Tailwind CSS.
- [**Axios**](https://axios-http.com/): A promise-based HTTP client for making API requests with interceptors for token management.

## Back-End
- [**Spring Boot Backend**](https://github.com/mbeps/oauth-nextjs-springboot-backend): A Java-based REST API that handles OAuth authentication, JWT token generation, and protected endpoint management.

# Setting Up Project
These are simple steps to run the application locally. For more detailed instructions, refer to the Wiki.

## 1. Clone the Project Locally
```sh
git clone https://github.com/mbeps/oauth-nextjs-springboot-frontend.git
cd oauth-nextjs-springboot-frontend
```

## 2. Set Up Environment
1. Copy the `.env.example` file and rename it to `.env.local`
2. Populate the `.env.local` with the required configuration:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (default: `http://localhost:8080`)

```
NEXT_PUBLIC_API_URL=''
NODE_ENV=''
```

## 3. Install Dependencies
```sh
npm install
```

## 5. Start the Backend
Ensure the [Spring Boot backend](https://github.com/mbeps/oauth-nextjs-springboot-backend) is running on `http://localhost:8080` (or your configured URL).
This will also need to be configured first.

## 6. Run the Frontend
```sh
npm run dev
```

Alternatively, you can build the whole app and start it:
```sh
npm run build-start
```
> This build the app first and then runs it.

The application should now be running on `http://localhost:3000`

# Usage

## Logging In
1. Navigate to the home page at `http://localhost:3000`
2. Click the "Sign in with GitHub" button
3. Authorise the application in GitHub
4. You will be redirected to the dashboard upon successful authentication

## Accessing Protected Routes
The dashboard at `/dashboard` is a protected route. 
Attempting to access it without authentication will redirect you to the login page.

## Performing Protected Actions
On the dashboard, you can:
- View your GitHub profile information
- Access protected data from the backend
- Perform authenticated actions using the action buttons
- Log out to end your session

## Token Management
The application automatically handles token refresh. 
When your access token expires, the system will use your refresh token to obtain a new access token without requiring re-authentication.

# References
- [Backend Repository](https://github.com/mbeps/oauth-nextjs-springboot-backend) 
- [Next.JS Documentation](https://nextjs.org/docs) 
- [React.JS Documenation](https://react.dev/reference/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 
- [Shadcn UI Documentation](https://ui.shadcn.com/) 