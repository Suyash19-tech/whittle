# Whittle - AI Spend Optimization Platform

A production-quality SaaS MVP for startup founders and engineering teams to audit and optimize their AI tool spending.

## 🎯 Product Vision

Whittle helps teams understand and reduce unnecessary spending on AI subscriptions and API tooling. In under 60 seconds, users can audit their AI stack and receive actionable recommendations to save thousands monthly.

## 🏗️ Architecture Overview

### Folder Structure

```
whittle/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Landing page
│   │   └── audit/              # Audit feature routes
│   │       ├── page.tsx        # Audit form
│   │       ├── results/[id]/   # Audit results
│   │       └── share/[id]/     # Shareable results
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── glass-card.tsx  # Glassmorphism card
│   │   │   └── gradient-button.tsx
│   │   └── shared/             # Shared layout components
│   │       ├── navbar.tsx
│   │       ├── footer.tsx
│   │       ├── container.tsx
│   │       └── section-wrapper.tsx
│   │
│   ├── lib/                    # Utility functions
│   │   └── utils.ts            # cn(), formatCurrency(), etc.
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAudit.ts         # Audit operations
│   │   └── useForm.ts          # Form state management
│   │
│   ├── store/                  # Zustand state management
│   │   ├── audit.store.ts      # Audit form & results state
│   │   └── ui.store.ts         # UI state (modals, theme)
│   │
│   ├── services/               # API & business logic
│   │   ├── api.ts              # HTTP client
│   │   └── audit.service.ts    # Audit API calls
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Core types
│   │
│   ├── constants/              # Application constants
│   │   └── index.ts            # Tools, pricing, use cases
│   │
│   ├── styles/                 # Global styles
│   │   └── globals.css         # Tailwind + custom utilities
│   │
│   └── test/                   # Test setup
│       └── setup.ts            # Vitest configuration
│
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── vitest.config.ts
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Emerald (trust, growth, financial health)
- **Neutral**: Slate (professional, clean)
- **Accent**: Amber (warnings), Red (high impact)

### Components
- **GlassCard**: Glassmorphism effect with soft gradients
- **GradientButton**: Premium gradient buttons with smooth transitions
- **Container**: Responsive max-width wrapper
- **SectionWrapper**: Consistent vertical spacing

### Typography
- **Font**: Inter (professional SaaS standard)
- **Hierarchy**: Proper scaling from h1-h4
- **Spacing**: Premium whitespace system

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icon library

### State Management
- **Zustand** - Lightweight, performant state management
- **Persist Middleware** - localStorage persistence

### Forms & Validation
- **React Hook Form** - Efficient form handling
- **Zod** - TypeScript-first schema validation

### Backend Integration
- **Supabase** - Database, auth, storage
- **Axios** - HTTP client with interceptors
- **OpenRouter API** - AI summaries

### Testing
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing

### Development
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 📋 Key Features (Planned)

### Phase 1 (MVP)
- ✅ Landing page with hero section
- ⏳ Audit form with tool selection
- ⏳ Results dashboard with recommendations
- ⏳ Share functionality
- ⏳ Export to PDF/CSV

### Phase 2
- Team collaboration
- Advanced analytics
- Custom integrations
- API access

### Phase 3
- Automated spend monitoring
- Predictive analytics
- Vendor management
- Budget alerts

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your environment variables
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# OPENROUTER_API_KEY=...
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test -- --watch
```

## 🌍 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter (AI Summaries)
OPENROUTER_API_KEY=your_openrouter_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🏛️ Architectural Decisions

### 1. **App Router (Next.js 15)**
- Modern, file-based routing
- Server components by default
- Better performance and DX

### 2. **Zustand for State Management**
- Lightweight alternative to Redux
- Minimal boilerplate
- Built-in devtools and persistence
- Perfect for SaaS applications

### 3. **Tailwind CSS**
- Utility-first approach
- Consistent design system
- Excellent performance
- Easy customization

### 4. **Glassmorphism Design**
- Modern, premium aesthetic
- Aligns with fintech inspiration (Stripe, Mercury)
- Subtle shadows and gradients
- Professional appearance

### 5. **Centralized API Service**
- Single source of truth for HTTP requests
- Interceptors for auth and error handling
- Easy to test and maintain
- Consistent error handling

### 6. **Type-Safe Throughout**
- TypeScript for all code
- Zod for runtime validation
- Prevents runtime errors
- Better IDE support

## 📦 Dependencies Installed

### Core
- `next@15.0.0` - React framework
- `react@19.0.0` - UI library
- `typescript@5.3.0` - Type safety

### Styling
- `tailwindcss@3.4.0` - Utility CSS
- `class-variance-authority@0.7.0` - Component variants
- `clsx@2.0.0` - Class merging
- `tailwind-merge@2.2.0` - Tailwind class merging

### Animation & Icons
- `framer-motion@10.16.0` - Smooth animations
- `lucide-react@0.292.0` - Icon library

### State & Forms
- `zustand@4.4.0` - State management
- `react-hook-form@7.48.0` - Form handling
- `zod@3.22.0` - Schema validation
- `@hookform/resolvers@3.3.0` - Form validation

### Backend Integration
- `@supabase/supabase-js@2.38.0` - Database & auth
- `axios@1.6.0` - HTTP client

### Development
- `eslint@8.54.0` - Linting
- `prettier@3.1.0` - Code formatting
- `vitest@1.0.0` - Testing framework
- `@testing-library/react@14.1.0` - Component testing

## 🎯 Next Steps

1. **Backend Setup**
   - Configure Supabase database schema
   - Set up authentication
   - Create API routes

2. **Audit Form Implementation**
   - Build tool selection interface
   - Implement form validation
   - Add tool management

3. **Results Dashboard**
   - Design results layout
   - Implement recommendation engine
   - Add visualization charts

4. **Sharing & Export**
   - Implement share functionality
   - Add PDF/CSV export
   - Create public share pages

5. **Testing**
   - Write unit tests
   - Add integration tests
   - Set up E2E testing

## 📝 Notes

- This is a **frontend-only foundation** - backend business logic is not implemented
- All components are production-ready and follow SaaS best practices
- The design system is extensible and can be easily customized
- Code includes architectural comments explaining key decisions
- Accessibility best practices are implemented throughout

## 📄 License

MIT

---

**Built with ❤️ for startup founders who care about financial intelligence.**
