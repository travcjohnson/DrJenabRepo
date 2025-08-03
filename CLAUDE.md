# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Next.js Application (Primary Implementation)
```bash
# Development server
cd dr-jenab-chat && npm run dev

# Build for production
cd dr-jenab-chat && npm run build

# Start production server
cd dr-jenab-chat && npm run start

# Lint code
cd dr-jenab-chat && npm run lint

# Install dependencies
cd dr-jenab-chat && npm install
```

### Standalone HTML Implementation (Legacy/Reference)
```bash
# Serve locally (Python 3)
python -m http.server 8000

# Or using Node.js
npx serve .
```

## Architecture Overview

This repository contains two implementations of a Dr. Jenab AI chat application:

### 1. Next.js Implementation (`dr-jenab-chat/`)
**Primary implementation** - Modern, production-ready Next.js 15 application with:
- **App Router**: Latest Next.js routing with TypeScript
- **Firebase Integration**: Authentication (Google OAuth) and Firestore database
- **OpenAI GPT-4**: Server-side API integration for AI responses
- **Medical Safety**: Emergency detection, disclaimers, appointment routing
- **Glassmorphic UI**: Modern design with Tailwind CSS
- **Security**: Server-side API calls, proper environment variable handling

**Key Components:**
- `src/app/api/chat/route.ts`: OpenAI API integration with medical safety checks
- `src/contexts/AuthContext.tsx`: Firebase authentication state management
- `src/app/chat/page.tsx`: Main chat interface with real-time messaging
- `src/lib/firebase.ts`: Firebase configuration and utilities

### 2. Standalone HTML Implementation (Root Level)
**Legacy reference** - Client-side HTML/CSS/JS implementation with:
- `index.html`: Landing page with Firebase Auth and navigation
- `chat.html`: Chat interface with fallback authentication
- `script.js`: Performance-optimized particle system and UI interactions
- `styles.css`: Glassmorphic design system with theme support

## Key Technical Patterns

### Authentication Strategy
The application uses **dual authentication** to handle both production Firebase and local development:

```javascript
// Check localStorage first (local development fallback)
const localAuth = localStorage.getItem('userSignedIn') === 'true';

// Fallback to Firebase authentication
onAuthStateChanged(auth, (user) => {
    if (!user && !localAuth) {
        // Redirect to sign-in
    }
});
```

### Medical Safety Implementation
Critical safety features implemented across both versions:

**Emergency Detection:**
```typescript
const emergencyKeywords = ['emergency', 'urgent', 'crisis', 'suicide', 'dying'];
const isEmergency = emergencyKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
);
```

**Medical Advice Prevention:**
- All responses include disclaimers for medical advice requests
- Consistent redirection to appointment booking for personal medical concerns
- Clear separation between educational information and medical consultation

### Performance Optimizations
The standalone implementation includes advanced performance features:
- **Object Pooling**: Particle system with reusable DOM elements
- **Intersection Observer**: Only animate visible glass cards
- **Hardware Acceleration**: CSS `transform: translateZ(0)` for GPU rendering
- **Throttled Event Handlers**: Optimized mouse movement tracking
- **Performance Monitoring**: FPS tracking with automatic quality reduction

## Environment Variables (Next.js)

Required environment variables for production:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Firebase Config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Appointment Booking URL
NEXT_PUBLIC_APPOINTMENT_URL=https://www.ucihealth.org/find-a-doctor/j/arvin-jenab
```

## Dr. Jenab AI Persona

The AI assistant is carefully crafted to embody Dr. Arvin Jenab's professional characteristics:

**Core Personality Traits:**
- Warm, approachable, professionally supportive
- Educational focus over personal medical advice
- Integration of naturopathic medicine principles
- Consistent appointment booking encouragement
- Evidence-based information delivery

**System Prompt Structure:**
```typescript
const SYSTEM_PROMPT = `You are Dr. Arvin Jenab, ND...
IMPORTANT GUIDELINES:
1. Provide educational information, NOT personal medical advice
2. Encourage scheduling appointments for specific medical questions
3. Share general naturopathic/integrative medicine information
4. Maintain warm, professional tone
5. Direct emergencies to 911 or immediate medical attention
`;
```

## Firebase Configuration

### Authentication Setup
- **Provider**: Google OAuth only
- **Fallback**: localStorage for local development
- **Security**: Proper authorized domains configuration

### Firestore Structure
```javascript
// Chat messages collection
{
  userId: string,
  userEmail: string, 
  message: string,
  role: 'user' | 'assistant',
  timestamp: serverTimestamp()
}
```

### Security Rules
```javascript
// Firestore rules ensure users can only access their own chat data
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Design System

### Glassmorphic Components
- **Base**: `rgba(255, 255, 255, 0.15)` background with `blur(20px)`
- **Borders**: Subtle opacity borders for depth
- **Shadows**: Multiple shadow layers for realistic depth
- **Animations**: Hardware-accelerated transforms for smooth interactions

### Theme System
- **Light/Dark Toggle**: Persistent localStorage theme preference
- **CSS Variables**: Consistent color system across themes
- **Responsive**: Mobile-first design with optimized particle counts

## Development Guidelines

### Code Style
- **TypeScript**: Strict type checking in Next.js implementation
- **Performance First**: Hardware acceleration, object pooling, throttled events
- **Medical Safety**: Always include appropriate disclaimers and emergency detection
- **Accessibility**: Semantic HTML, keyboard navigation, screen reader support

### Testing Strategy
- **Manual Testing**: Authentication flows, chat functionality, responsive design
- **Safety Testing**: Emergency keyword detection, medical advice prevention
- **Performance Testing**: Particle animation performance, memory usage

### Deployment Considerations
- **Environment Variables**: Secure API key management
- **Firebase Domains**: Update authorized domains for production URLs
- **Performance**: Enable CDN, optimize assets, monitor Core Web Vitals
- **Security**: Server-side API calls, proper CORS configuration

## Common Development Tasks

### Adding New AI Responses
1. Update system prompt in `src/app/api/chat/route.ts`
2. Test emergency detection keywords
3. Ensure medical disclaimers are included
4. Update fallback responses in `chat.html` for consistency

### Modifying UI Components
1. Update glassmorphic styles in CSS/Tailwind
2. Maintain theme compatibility (light/dark)
3. Test responsive behavior on mobile devices
4. Ensure accessibility standards are met

### Firebase Integration Changes
1. Update security rules in `firestore.rules`
2. Test authentication flows (Google OAuth + localStorage fallback)
3. Verify data access permissions
4. Update environment variables across deployments

## Medical Compliance Notes

This application is designed for **educational purposes only** and includes multiple safety layers:
- Emergency detection with immediate 911 redirection
- Medical advice prevention with appointment booking encouragement  
- Clear disclaimers throughout the user interface
- Professional boundaries between AI education and medical consultation

Always maintain these safety standards when making any modifications to the chat functionality or AI responses.