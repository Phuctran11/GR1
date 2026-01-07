# JP-Master Frontend

> React-based Japanese learning platform with AI-powered content generation

---

## 🎨 Tech Stack

### Core
- **React 19.2.0** - Modern UI library with latest features
- **React Router 6.20.0** - Client-side routing
- **Vite 7.2.4** - Fast build tool with HMR

### Styling
- **Tailwind CSS 3.4.7** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processor
- **Autoprefixer** - Cross-browser CSS compatibility

### Icons & Assets
- **React Icons 4.12.0** - Icon library (FontAwesome, Material, etc.)

### Code Quality
- **ESLint 9.39** - Code linting
- **eslint-plugin-react-hooks** - React Hooks rules
- **eslint-plugin-react-refresh** - Fast Refresh support

---

## 📁 Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── BackButton.jsx
│   │   ├── Button.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── Flashcard.jsx
│   │   ├── Hero.jsx
│   │   ├── InfoChip.jsx
│   │   ├── InfoSection.jsx
│   │   ├── LevelCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── NavButton.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ProgressMini.jsx
│   │   ├── RememberButton.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── StatCard.jsx
│   │   ├── about/       # About page components
│   │   └── flashcard/   # Flashcard components
│   │       ├── BookPage.jsx
│   │       ├── FlashcardHeader.jsx
│   │       ├── FlipCard.jsx
│   │       └── Spine.jsx
│   │
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Features.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── FlashcardPage.jsx
│   │   └── ReadingGenerate.jsx
│   │
│   ├── utils/           # Helper functions
│   │   ├── flashcardProgress.js  # Flashcard logic
│   │   └── levelProgress.js      # Progress calculation
│   │
│   ├── apiClient.js     # API integration layer
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind imports
│
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.cjs   # PostCSS configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Server
- URL: http://localhost:5173
- Hot Module Replacement (HMR) enabled
- Fast Refresh for instant updates

---

## 🎯 Key Features

### Flashcard System
- **3D flip animation** with CSS transforms
- **Book-like interface** with spine navigation
- **Progress tracking** (New/Learning/Remembered/Forgotten)
- **Level-based filtering** (N5-N1)
- **Review count display**

### Reading Generation
- **Form-based interface** for reading parameters
- **Vocabulary selection** (multi-select)
- **Genre & length options**
- **AI-generated content** display
- **Translation & romaji** toggle

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Touch-optimized interactions

### Routing
```
/ ...................... Home page
/about ................. About page
/features .............. Features showcase
/login ................. Login page
/signup ................ Signup page
/flashcard/:level ...... Flashcard by level
/reading/generate ...... Reading generation
```

---

## 🎨 Component Library

### Layout Components
- `<Navbar />` - Navigation header
- `<Hero />` - Landing page hero
- `<SectionHeader />` - Section title
- `<BackButton />` - Navigation button

### Interactive Components
- `<Flashcard />` - Vocabulary card with flip
- `<FlipCard />` - 3D flip container
- `<BookPage />` - Book page layout
- `<LevelCard />` - Level selection card

### UI Components
- `<Button />` - Reusable button
- `<ProgressBar />` - Progress indicator
- `<ProgressMini />` - Compact progress
- `<StatCard />` - Statistics display
- `<InfoChip />` - Info badge
- `<RememberButton />` - Action button

---

## 🔌 API Integration

Located in `apiClient.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api'

// Auth
signup(username, email, password, fullName)
login(email, password)
logout()
getCurrentUser()

// Flashcards
getFlashcardProgress(level)
saveFlashcardProgress(vocabId, status)

// Reading
generateReading(vocabIds, genre, length, level)
getReading(readingId)
generateQuiz(readingId, count)
generateTTS(readingId)
```

---

## 🎨 Styling Guide

### Tailwind Configuration
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {...},
      accent: {...}
    }
  }
}
```

### Global Styles
- Defined in `App.css` and `index.css`
- CSS variables for theming
- Custom animations

---

## 🔧 Configuration Files

### Vite Config
```javascript
// vite.config.js
plugins: [react()]
server: { port: 5173 }
```

### ESLint Config
```javascript
// eslint.config.js
extends: [
  'eslint:recommended',
  'plugin:react-hooks/recommended'
]
```

---

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

Output: `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel** - Zero config deployment
- **Netlify** - Continuous deployment
- **GitHub Pages** - Static hosting
- **Docker** - Containerized deployment

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### HMR Not Working
- Check Vite server is running
- Verify file paths are correct
- Clear browser cache

---

## 🧪 Testing

Currently using manual testing. Future plans:
- Jest for unit tests
- React Testing Library
- Cypress for E2E tests

---

## 📝 Code Style

- **Components**: PascalCase (e.g., `FlashCard.jsx`)
- **Utils**: camelCase (e.g., `levelProgress.js`)
- **CSS**: Tailwind utility classes
- **Props**: Destructured in function params
- **State**: React Hooks (useState, useEffect)

---

## 🔄 State Management

Currently using:
- **React useState** - Component state
- **React Context** - Future plan for global state
- **localStorage** - Persistent data

Future considerations:
- Zustand for global state
- React Query for server state

---

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

---

## 🤝 Contributing

1. Follow component structure
2. Use Tailwind for styling
3. Add PropTypes for props
4. Keep components small and focused
5. Test on multiple browsers

---

## 📧 Support

For frontend-specific issues:
- Check console for errors
- Verify API connectivity
- Review component props

