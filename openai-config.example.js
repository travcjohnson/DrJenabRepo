// OpenAI Configuration Template
// IMPORTANT: In production, this should be handled server-side for security

// Copy this file to openai-config.js and replace 'your-openai-api-key-here' with your actual API key
const OPENAI_CONFIG = {
    apiKey: 'your-openai-api-key-here', // Replace with your actual OpenAI API key
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    maxTokens: 500,
    temperature: 0.7
};

// Instructions:
// 1. Copy this file to openai-config.js
// 2. Replace 'your-openai-api-key-here' with your actual OpenAI API key
// 3. Do not commit the actual API key to version control
// 4. For production, move this to server-side environment variables