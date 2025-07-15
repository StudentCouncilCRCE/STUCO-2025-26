## STUCO-2025-26

Official website and management portal for the Students' Council 2025-26 at Fr. Conceicao Rodrigues College of Engineering (CRCE).

### Overview
This project is a full-stack web application for the student council, featuring:
- Authentication (email/password, verification, profile management)
- Event and member showcase
- Modern UI with Tailwind CSS and Radix UI
- Secure backend with Drizzle ORM and MySQL
- Email notifications via SMTP

### Technologies Used
- [Remix](https://remix.run/) (React framework)
- [Drizzle ORM](https://orm.drizzle.team/) (MySQL)
- [Better Auth](https://www.npmjs.com/package/better-auth) (authentication)
- [Tailwind CSS](https://tailwindcss.com/) (UI)
- [Radix UI](https://www.radix-ui.com/)
- [Nodemailer](https://nodemailer.com/) (email)

### Getting Started
1. Clone the repository and install dependencies:
   ```sh
   npm install
   ```
2. Set up your environment variables (see below).
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Access the app at `http://localhost:3000` (default).

### Environment Variables
Create a `.env` file in the root directory and add:
```
SESSION_SECRET=
DATABASE_URL=
BETTER_AUTH_SECRET=
SMTP_USER=
SMTP_PASS=
CRAWLEE_PERSIST_STORAGE=
CRAWLEE_STORAGE_DIR=
```
See documentation for details on each variable.

### Usage
- **Authentication:** Secure sign up/sign in with email verification.
- **Events & Members:** Browse council members and events.
- **Settings:** Manage your profile and account settings.

### Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Lint code

### License
MIT
