# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Project Status: PRODUCTION DEPLOYED ✅

A fully functional Dr. Jenab AI chat application deployed to:
- **Vercel**: https://dr-arvin-jenab-ekz6jjpal-travcjohnsons-projects.vercel.app
- **GitHub Pages**: https://travcjohnson.github.io/DrJenabRepo

## Development Commands

### Local Development
```bash
# Start development server
python -m http.server 8000
# or
npx serve .

# Visit http://localhost:8000
```

### Deployment
```bash
# Deploy to Vercel
npx vercel --prod

# GitHub Pages deploys automatically on push to main branch
```

### Configuration Setup
```bash
# Set up API key (required for chat functionality)
cp openai-config.example.js openai-config.js
# Edit openai-config.js with your OpenAI API key
```

## Project Architecture

This is a **single-page application** with vanilla HTML/CSS/JavaScript:

### Core Files
- **`index.html`** - Landing page with authentication and navigation
- **`chat.html`** - AI chat interface with Dr. Jenab persona
- **`script.js`** - Authentication, UI interactions, performance optimizations
- **`styles.css`** - Glassmorphic design system with theme support
- **`openai-config.example.js`** - Secure API configuration template

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript ES6+
- **Authentication**: Firebase Auth (Google OAuth) + localStorage fallback
- **Database**: Firestore for chat message storage
- **AI**: OpenAI GPT-4 API integration
- **Design**: CSS Variables, Glassmorphism, Hardware acceleration
- **Deployment**: Vercel (primary) + GitHub Pages (backup)

## Key Features Implemented

### Authentication Flow
1. User clicks "Sign In" on landing page
2. Google OAuth authentication (or localStorage fallback for development)
3. **Automatic redirect** to chat.html after successful sign-in
4. **Persistent chat bubble** appears in header for easy navigation
5. Sign out returns to homepage and removes chat bubble

### Chat Interface
- Real-time AI responses using OpenAI GPT-4
- Suggested health-related questions
- Medical safety features (emergency detection, disclaimers)
- Appointment booking integration with UCI Health
- Message history stored in Firestore

### UI/UX Design
- **Glassmorphic Design**: Modern blur effects with CSS backdrop-filter
- **Theme System**: Light/dark mode with persistent preferences
- **Performance Optimized**: Object pooling for particles, hardware acceleration
- **Responsive**: Mobile-first design with optimized layouts
- **Accessibility**: Proper semantic HTML and keyboard navigation

## Dr. Jenab AI Persona

### Professional Implementation
The AI assistant embodies Dr. Arvin Jenab's authentic characteristics:
- 20+ years naturopathic medicine experience
- Medical Director at UCI Susan Samueli Integrative Health Institute
- Specializes in chronic conditions, digestive disorders, mood disorders
- Warm, educational communication style with professional boundaries

### Medical Safety Features
- **Emergency Detection**: Keywords trigger immediate 911 referral
- **Educational Only**: All responses include disclaimers
- **Appointment Encouragement**: Medical questions redirect to booking
- **Professional Boundaries**: Clear separation of AI education vs. medical advice

### System Prompt Structure
Located in `openai-config.example.js`, includes:
- Comprehensive professional background
- Clinical specialties and treatment modalities
- Communication guidelines and safety protocols
- Contact information and appointment booking details

## Technical Implementation Details

### Authentication Strategy
Dual authentication system for flexibility:
```javascript
// Check localStorage first (development fallback)
const localAuth = localStorage.getItem('userSignedIn') === 'true';

// Firebase authentication (production)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Redirect to chat after sign-in
        window.location.href = 'chat.html';
    }
});
```

### Performance Optimizations
- **Particle System**: Object pooling with reusable DOM elements
- **Glass Card Effects**: Intersection Observer for visible elements only
- **Hardware Acceleration**: CSS `transform: translateZ(0)` for GPU rendering
- **Event Handling**: Throttled mouse events for smooth interactions
- **Memory Management**: Proper cleanup on page unload

### Security Implementation
- **API Key Protection**: Template-based configuration, .gitignore exclusion
- **Firebase Security**: Proper rules ensuring users access only their data
- **HTTPS Only**: Production deployments use secure connections
- **No Client-side Secrets**: All sensitive operations server-side ready

## Configuration Management

### Environment Variables
```bash
# For production deployment
OPENAI_API_KEY=your_api_key_here

# Firebase configuration (public, safe for client-side)
# Already configured in HTML files
```

### Firebase Setup
- **Authentication**: Google OAuth provider enabled
- **Firestore**: Chat message storage with user-scoped access
- **Authorized Domains**: Production URLs added for OAuth
- **Security Rules**: Users can only read/write their own chat data

## Development Guidelines

### Code Patterns
- **ES6+ JavaScript**: Modern syntax with proper async/await
- **CSS Variables**: Consistent theming system
- **Hardware Acceleration**: Optimize animations for smooth performance
- **Medical Safety**: Always include appropriate disclaimers
- **Error Handling**: Graceful fallbacks for all external services

### Testing Approach
Follow `test-checklist.md` for comprehensive validation:
1. Authentication flow (sign-in → redirect → chat bubble)
2. Chat functionality (messages, AI responses, suggestions)
3. Sign-out flow (loading state → redirect → cleanup)
4. Responsive design across devices
5. Theme toggle functionality
6. Performance on various devices

### Deployment Process
1. **Local Testing**: Verify all functionality works locally
2. **API Key Setup**: Configure OpenAI API key (not in version control)
3. **Firebase Configuration**: Update authorized domains for production
4. **Deploy**: Push to GitHub (auto-deploys to Pages) + Vercel deploy
5. **Verification**: Test live deployments for full functionality

## Common Development Tasks

### Adding New AI Responses
1. Update system prompt in `openai-config.example.js`
2. Test locally with your API key
3. Ensure medical disclaimers are appropriate
4. Deploy and test in production

### UI/UX Modifications
1. Update styles in `styles.css` (use CSS variables for consistency)
2. Test both light and dark themes
3. Verify responsive behavior on mobile
4. Check hardware-accelerated animations perform well

### Authentication Changes
1. Update Firebase configuration if needed
2. Test both Firebase and localStorage fallback flows
3. Verify authorized domains in Firebase console
4. Test complete sign-in/sign-out cycle

## Production URLs

- **Primary Deployment**: https://dr-arvin-jenab-ekz6jjpal-travcjohnsons-projects.vercel.app
- **Backup Deployment**: https://travcjohnson.github.io/DrJenabRepo
- **Repository**: https://github.com/travcjohnson/DrJenabRepo

## Support & Maintenance

### Monitoring
- Check Firebase usage for authentication and database
- Monitor OpenAI API usage and costs
- Verify deployments are functioning correctly
- Review any error logs in browser console

### Updates
- Keep dependencies secure (Firebase, OpenAI API versions)
- Monitor for any security advisories
- Update documentation when making changes
- Test thoroughly before deploying updates

This application is production-ready and deployed. All documentation reflects the current state as of August 2025.