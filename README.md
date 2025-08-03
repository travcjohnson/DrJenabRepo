# Dr. Arvin Jenab AI Chat Application

A professional AI chat application featuring Dr. Arvin Jenab, ND, Medical Director of Naturopathic Medicine at UCI Susan Samueli Integrative Health Institute.

## 🚀 Live Deployments

- **Vercel (Primary)**: https://dr-arvin-jenab-ekz6jjpal-travcjohnsons-projects.vercel.app
- **GitHub Pages**: https://travcjohnson.github.io/DrJenabRepo

## ✨ Features

### Core Functionality
- **AI Chat Interface**: Conversational AI powered by OpenAI GPT-4 with authentic Dr. Jenab persona
- **Firebase Authentication**: Google OAuth sign-in with localStorage fallback for development
- **Medical Safety**: Emergency detection, disclaimers, and appointment booking integration
- **Responsive Design**: Mobile-first glassmorphic UI with dark/light theme support

### User Experience
- **Streamlined Flow**: Sign-in → Auto-redirect to chat → Persistent chat bubble navigation
- **Real-time Chat**: Instant messaging with suggested health-related questions
- **Professional Interface**: Medical-grade design with proper disclaimers and safety measures
- **Performance Optimized**: Hardware-accelerated animations with object pooling for particles

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Authentication**: Firebase Auth with Google OAuth
- **Database**: Firestore for chat message storage
- **AI Integration**: OpenAI GPT-4 API
- **Deployment**: Vercel + GitHub Pages
- **Design**: CSS Variables, Glassmorphism, Hardware-accelerated animations

### Key Components
- `index.html` - Landing page with authentication and navigation
- `chat.html` - Chat interface with AI integration
- `script.js` - Authentication, UI interactions, and performance optimizations
- `styles.css` - Glassmorphic design system with theme support
- `openai-config.example.js` - Template for secure API configuration

## 🔧 Setup & Development

### Prerequisites
- Modern web browser with ES6+ support
- OpenAI API key
- Firebase project (optional for local development)

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/travcjohnson/DrJenabRepo.git
   cd DrJenabRepo
   ```

2. **Configure OpenAI API**
   ```bash
   cp openai-config.example.js openai-config.js
   # Edit openai-config.js and add your OpenAI API key
   ```

3. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Visit http://localhost:8000
   ```

### Development Commands
```bash
# Start local development server
python -m http.server 8000

# Deploy to Vercel
npx vercel --prod

# Test authentication flow
# Visit index.html → Click Sign In → Should redirect to chat.html
```

## 🔒 Security & Configuration

### API Key Management
- ✅ API keys excluded from version control via `.gitignore`
- ✅ Template-based configuration (`openai-config.example.js`)
- ✅ Environment variable support for production
- ✅ Server-side API calls recommended for production

### Medical Safety Features
- **Emergency Detection**: Automatic detection of crisis keywords → immediate 911 referral
- **Medical Disclaimers**: Prominent warnings that chat is educational only
- **Appointment Integration**: Consistent redirection to UCI Health booking
- **Professional Boundaries**: Clear separation between AI education and medical advice

### Firebase Security
- Authentication required for chat access
- Firestore rules ensure users can only access their own data
- Authorized domains configured for production URLs

## 📖 Documentation

### For Developers
- [`CLAUDE.md`](CLAUDE.md) - Development guide for Claude Code
- [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) - Comprehensive deployment procedures
- [`test-checklist.md`](test-checklist.md) - Quick testing validation

### Configuration Files
- [`openai-config.example.js`](openai-config.example.js) - API configuration template
- [`.gitignore`](.gitignore) - Security and cleanup rules
- [`firestore.rules`](dr-jenab-chat/firestore.rules) - Database security rules

## 🧪 Testing

### Manual Testing Checklist
1. **Authentication Flow**
   - Sign in → Should redirect to chat
   - Chat bubble appears in header when signed in
   - Sign out → Returns to homepage, chat bubble disappears

2. **Chat Functionality**
   - Send message → Receive AI response
   - Suggested questions work correctly
   - Medical disclaimers visible

3. **Responsive Design**
   - Mobile/tablet layouts function properly
   - Theme toggle works across devices
   - Animations perform smoothly

## 🌟 Dr. Jenab AI Persona

The AI assistant embodies Dr. Arvin Jenab's authentic professional characteristics:

### Professional Background
- 20+ years in naturopathic and integrative medicine
- Medical Director at UCI Susan Samueli Integrative Health Institute
- McGill University and CCNM education
- Board positions and leadership in naturopathic medicine

### Specialties
- Chronic and complex health conditions
- Digestive disorders and gastrointestinal health
- Mood disorders and mental health integration
- Integrative treatment approaches

### Communication Style
- Warm, collaborative, and educational
- Evidence-based information delivery
- Consistent appointment booking encouragement
- Professional boundary maintenance

## 📞 Contact & Appointments

**Dr. Arvin Jenab, ND**
- **Phone**: (949) 824-7000
- **Online Booking**: [UCI Health Portal](https://www.ucihealth.org/find-a-doctor/j/arvin-jenab)

**Locations**:
- **Irvine**: Susan Samueli Integrative Health Institute, 856 Health Sciences Rd, Suite 2600
- **Costa Mesa**: 1202 Bristol Street, Floor 2

## 📝 License & Usage

This application is designed for educational purposes and professional representation of Dr. Arvin Jenab's practice. All AI responses include appropriate medical disclaimers and encourage professional consultation for health concerns.

---

**Last Updated**: August 2025  
**Status**: Production Ready ✅  
**Live Demo**: [Visit Vercel Deployment](https://dr-arvin-jenab-ekz6jjpal-travcjohnsons-projects.vercel.app)