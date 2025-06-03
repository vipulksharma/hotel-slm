# Legal India

A modern web application for creating legal documents easily.

## Features

- Create various legal documents (rent agreements, affidavits, etc.)
- Mobile-friendly Progressive Web App (PWA)
- SEO optimized
- Analytics integration
- Real-time document editing
- Secure user authentication
- Database persistence

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (MySQL)
- PWA Support
- Vercel Analytics

## Prerequisites

- Node.js 18+ 
- MySQL 8+
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd legal-india
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="mysql://root:password@localhost:3306/legal_india"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utility functions and configurations
├── prisma/          # Database schema and migrations
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

