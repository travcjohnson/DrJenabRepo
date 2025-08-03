# Dr. Jenab AI Chat Application

A Next.js application with Firebase authentication and OpenAI integration for educational health conversations with Dr. Arvin Jenab's AI assistant.

## Features

- **Google Sign-In**: Secure authentication via Firebase Auth
- **AI Chat Interface**: Chat with Dr. Jenab's AI assistant for educational health information
- **Community Testimonials**: Share and like health journey experiences
- **Appointment Booking**: Direct links to schedule real appointments
- **Glassmorphic Design**: Beautiful, modern UI with glass effect cards

## Security & Compliance

- **Educational Only**: AI provides general health education, not medical advice
- **Medical Disclaimers**: Prominent disclaimers throughout the app
- **Content Filtering**: Blocks personal health information sharing
- **Secure API**: OpenAI key stored server-side only

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and select Google as a sign-in provider
3. Enable Firestore Database
4. Deploy security rules: `firebase deploy --only firestore:rules`

### 2. Environment Variables

The `.env.local` file is already configured with your Firebase and OpenAI credentials.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── api/chat/      # OpenAI API endpoint
│   ├── chat/          # Chat interface page
│   └── page.tsx       # Home page with testimonials
├── components/        # Reusable components
├── contexts/          # Auth context provider
└── lib/              # Firebase config & utilities
```

## Key Features Implementation

### Dr. Jenab's AI Personality
- 20+ years integrative medicine experience
- Specializes in chronic conditions, digestive health, mood disorders
- Educational responses only, no medical advice
- Encourages booking real appointments for personal care

### Community Features
- Authenticated users can post testimonials
- Like/heart other users' experiences
- 500 character limit for safety
- Real-time updates via Firestore

### Security Measures
- Server-side OpenAI API calls only
- Firebase security rules for data access
- Emergency keyword detection
- Medical content filtering

## Deployment

### Deploy to Vercel

```bash
vercel
```

### Deploy to Firebase Hosting

```bash
firebase deploy
```

## Important Notes

- This is NOT a HIPAA-compliant medical platform
- Users should not share personal health information
- All AI responses are educational only
- Real medical concerns should be directed to appointments

## Support

For issues or questions about the application, please contact the development team.