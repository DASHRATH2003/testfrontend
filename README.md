# Frontend - Movie & TV Show Manager

This is the frontend application for the Movie & TV Show Manager project, built with React, TypeScript, and Vite.

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- Radix UI for accessible components
- Zod for form validation
- Axios for API calls

## Features

- 🎬 Manage Movies and TV Shows in a single interface
- 📱 Responsive design for mobile and desktop
- 🔄 Infinite scroll for efficient data loading
- ✨ Real-time form validation
- 🎨 Modern UI with TailwindCSS
- 🚀 Fast development with Vite
- 📊 Data table with sorting and formatting
- 🗑️ Confirmation modals for delete actions

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── DataTable/       # Generic table component
│   ├── DeleteModal/     # Confirmation dialog
│   ├── MovieForm/       # Movie creation/edit form
│   └── TVShowForm/      # TV Show creation/edit form
├── lib/                 # Utilities and API functions
│   └── api.ts          # API client configuration
├── types/              # TypeScript type definitions
├── assets/             # Static assets
└── App.tsx             # Main application component
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

The application will start on http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Component Documentation

### DataTable
- Generic table component with infinite scroll
- Supports custom column rendering
- Mobile-responsive with card view for small screens

### MovieForm / TVShowForm
- Form components with real-time validation
- Floating labels and error messages
- Responsive grid layout
- Number formatting for budget and duration

### DeleteModal
- Confirmation dialog for delete actions
- Accessible using Radix UI Dialog
- Keyboard navigation support

## API Integration

The frontend communicates with the backend using these endpoints:

### Movies
- GET `/api/movies` - Fetch movies with pagination
- POST `/api/movies` - Create new movie
- PUT `/api/movies/:id` - Update movie
- DELETE `/api/movies/:id` - Delete movie

### TV Shows
- GET `/api/tvshows` - Fetch TV shows with pagination
- POST `/api/tvshows` - Create new TV show
- PUT `/api/tvshows/:id` - Update TV show
- DELETE `/api/tvshows/:id` - Delete TV show

## Development Guidelines

1. **TypeScript**
   - Use proper type definitions
   - Avoid using `any` type
   - Create interfaces for all data structures

2. **Components**
   - Keep components small and focused
   - Use TypeScript props interface
   - Implement proper error handling
   - Add loading states

3. **Styling**
   - Use TailwindCSS utility classes
   - Follow mobile-first approach
   - Maintain consistent spacing
   - Use CSS variables for theming

4. **State Management**
   - Use React hooks effectively
   - Implement proper loading states
   - Handle errors gracefully
   - Optimize re-renders

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 
