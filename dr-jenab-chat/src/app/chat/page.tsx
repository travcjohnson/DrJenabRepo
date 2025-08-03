'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user && mounted) {
      router.push('/');
    }
  }, [user, router, mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (mounted) {
      // Set theme
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.body.setAttribute('data-theme', savedTheme);

      // Particle system
      const particles = document.getElementById('particles');
      if (particles) {
        particles.innerHTML = '';
        
        const createParticle = () => {
          const particle = document.createElement('div');
          particle.className = 'particle';
          
          const size = Math.random() * 6 + 2;
          const startX = Math.random() * window.innerWidth;
          const duration = Math.random() * 10 + 10;
          
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.left = `${startX}px`;
          particle.style.animationDuration = `${duration}s`;
          
          particles.appendChild(particle);
          
          setTimeout(() => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          }, duration * 1000);
        };

        const particleInterval = setInterval(createParticle, 200);
        
        return () => clearInterval(particleInterval);
      }
    }
  }, [mounted]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.response) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

      if (data.suggestAppointment) {
        setTimeout(() => {
          const appointmentSuggestion: Message = {
            role: 'assistant',
            content: `Would you like to schedule an appointment to discuss this further? You can book online at ${data.appointmentUrl} or call (949) 824-7000.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, appointmentSuggestion]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment or contact the office directly at (949) 824-7000.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What is naturopathic medicine?",
    "How do you approach digestive health?",
    "What integrative treatments do you offer?",
    "Tell me about your philosophy on chronic conditions"
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div>
      {/* Particle Background */}
      <div className="particles" id="particles"></div>
      
      <div className="container">
        {/* Header */}
        <div className="hero" style={{marginBottom: '2rem'}}>
          <div className="glass-card hero-card" style={{padding: '2rem'}}>
            <button 
              onClick={() => router.push('/')}
              className="glass-button"
              style={{marginBottom: '1rem', padding: '0.5rem 1rem'}}
            >
              ← Back to Home
            </button>
            <h1 className="hero-title" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Chat with Dr. Jenab</h1>
            <p className="hero-subtitle">Educational health information and guidance</p>
            
            {/* Medical Disclaimer */}
            <div className="glass-card" style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.2)'
            }}>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color: '#f59e0b', marginTop: '0.25rem'}}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div style={{fontSize: '0.875rem'}}>
                  <p style={{fontWeight: '600', marginBottom: '0.25rem'}}>Important Medical Disclaimer</p>
                  <p>This chat provides educational information only and does not constitute medical advice, diagnosis, or treatment. 
                  Always consult with Dr. Jenab or qualified healthcare providers for personal medical concerns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start'}}>
          {/* Chat Area */}
          <div className="glass-card" style={{padding: '0', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column'}}>
            {/* Messages */}
            <div style={{flex: '1', overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {messages.length === 0 && (
                <div style={{textAlign: 'center', marginTop: '5rem', opacity: '0.7'}}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{margin: '0 auto 1rem'}}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p>Hello! I'm here to provide educational information about health and wellness.</p>
                  <p style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>Ask me anything about naturopathic medicine or integrative health.</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {message.role === 'assistant' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--glass-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: '0'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '80%',
                      borderRadius: '1rem',
                      padding: '1rem',
                      background: message.role === 'user' 
                        ? 'var(--glass-bg)' 
                        : 'rgba(255, 255, 255, 0.5)',
                      border: message.role === 'user' 
                        ? '1px solid var(--glass-border)'
                        : '1px solid rgba(0, 0, 0, 0.1)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--glass-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: '0'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div style={{display: 'flex', gap: '0.75rem'}}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--glass-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '1rem',
                    padding: '1rem',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{display: 'flex', gap: '4px'}}>
                      <div style={{width: '8px', height: '8px', background: '#666', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite both'}} />
                      <div style={{width: '8px', height: '8px', background: '#666', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite both', animationDelay: '0.16s'}} />
                      <div style={{width: '8px', height: '8px', background: '#666', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite both', animationDelay: '0.32s'}} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{borderTop: '1px solid var(--glass-border)', padding: '1rem'}}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                style={{display: 'flex', gap: '0.75rem'}}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about health and wellness..."
                  style={{
                    flex: '1',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="glass-button"
                  style={{padding: '0.75rem 1.5rem'}}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {/* Suggested Questions */}
            <div className="glass-card" style={{padding: '1.5rem'}}>
              <h3 style={{fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem'}}>Suggested Questions</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Appointment */}
            <div className="glass-card" style={{
              padding: '1.5rem',
              textAlign: 'center',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{margin: '0 auto 0.5rem', color: '#3b82f6'}}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3 style={{fontWeight: '600', marginBottom: '0.5rem'}}>Need Personal Care?</h3>
              <p style={{fontSize: '0.875rem', marginBottom: '1rem', opacity: '0.8'}}>Schedule an appointment for personalized medical advice</p>
              <a
                href="https://www.ucihealth.org/find-a-doctor/j/arvin-jenab"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem'
                }}
              >
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}