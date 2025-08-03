# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project: `dr-jenab-chat`
4. Enable Google Analytics (optional)
5. Complete project creation

## 2. Enable Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable **Google** provider
3. Add your domain to authorized domains:
   - `localhost` (for development)
   - Your production domain (if deployed)

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click **Done**

## 4. Get Configuration Keys

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Name your app: `Dr Jenab Chat`
5. Copy the configuration object

## 5. Update Code with Your Keys

Replace the placeholder configuration in both `index.html` and `chat.html`:

```javascript
// Replace this placeholder config:
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "dr-jenab-chat.firebaseapp.com",
    projectId: "dr-jenab-chat",
    storageBucket: "dr-jenab-chat.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id-here"
};

// With your actual config from Firebase Console:
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef..."
};
```

## 6. Firestore Security Rules (Optional)

For production, update Firestore rules to secure chat data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own chat messages
    match /chats/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 7. Test Authentication

1. Open your website locally
2. Click "Sign In" button
3. Complete Google sign-in flow
4. Verify user appears in Firebase Authentication console
5. Test chat functionality
6. Check Firestore console for chat messages

## Current Status

✅ Firebase SDK integrated
✅ Google Authentication implemented
✅ Firestore chat storage ready
⚠️ Placeholder Firebase config (needs real keys)
⚠️ Basic keyword-based responses (pending OpenAI integration)

## Next Steps

1. Set up Firebase project and get real configuration keys
2. Test authentication flow
3. Integrate OpenAI API for intelligent responses
4. Add production security rules