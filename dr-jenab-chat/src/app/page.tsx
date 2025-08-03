'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Theme toggle functionality
      const themeToggle = document.getElementById('themeToggle');
      const body = document.body;

      const toggleTheme = () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      };

      // Set initial theme
      const savedTheme = localStorage.getItem('theme') || 'light';
      body.setAttribute('data-theme', savedTheme);

      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        return () => themeToggle.removeEventListener('click', toggleTheme);
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      // Particle system
      const particles = document.getElementById('particles');
      if (particles) {
        // Clear existing particles
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

        // Create particles periodically
        const particleInterval = setInterval(createParticle, 200);
        
        return () => clearInterval(particleInterval);
      }
    }
  }, [mounted]);

  const handleChatClick = async () => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Sign in error:', error);
      }
    } else {
      router.push('/chat');
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div>
      <div className="container">
        {/* Theme Toggle */}
        <div className="theme-toggle">
          <button id="themeToggle" className="glass-button theme-btn">
            <svg className="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
            </svg>
            <svg className="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'none'}}>
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
          </button>
        </div>
        
        {/* Particle Background */}
        <div className="particles" id="particles"></div>
        
        {/* Hero Section */}
        <header className="hero">
          <div className="glass-card hero-card">
            <div className="hero-content">
              <h1 className="hero-title">Dr. Arvin Jenab, ND</h1>
              <p className="hero-subtitle">Medical Director of Naturopathic Medicine</p>
              <p className="hero-description">UCI Susan Samueli Integrative Health Institute</p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">20+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4.7★</span>
                  <span className="stat-label">Patient Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-number">UCI</span>
                  <span className="stat-label">Health</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Cards */}
        <main className="navigation-grid">
          <div className="glass-card nav-card" data-page="about" data-color="#e0f2ff">
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 className="card-title">About Dr. Jenab</h3>
            <p className="card-description">Learn about his background, education from McGill University and CCNM, and journey in integrative medicine</p>
            <div className="card-arrow">→</div>
          </div>

          <div className="glass-card nav-card" data-page="services" data-color="#fff0e6">
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="card-title">Clinical Specialties</h3>
            <p className="card-description">Chronic conditions, digestive disorders, mood disorders, and holistic treatment approaches</p>
            <div className="card-arrow">→</div>
          </div>

          <div className="glass-card nav-card" data-page="leadership" data-color="#f0fff0">
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="card-title">Leadership & Education</h3>
            <p className="card-description">Residency Director, Board positions, and advancing naturopathic medicine education</p>
            <div className="card-arrow">→</div>
          </div>

          <div className="glass-card nav-card" data-page="philosophy" data-color="#fff5f5">
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h3 className="card-title">Treatment Philosophy</h3>
            <p className="card-description">Integrative approach to chronic illness and whole-person health optimization</p>
            <div className="card-arrow">→</div>
          </div>

          <div className="glass-card nav-card" data-page="locations" data-color="#f8f0ff">
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="card-title">Locations & Contact</h3>
            <p className="card-description">UCI Health locations in Irvine and Costa Mesa, appointment scheduling and contact information</p>
            <div className="card-arrow">→</div>
          </div>

          {/* NEW CHAT CARD */}
          <div className="glass-card nav-card" data-color="#e8f5e8" onClick={handleChatClick} style={{cursor: 'pointer'}}>
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="card-title">Chat with Dr. Jenab</h3>
            <p className="card-description">
              {user ? 'Get educational health information from Dr. Jenab\'s AI assistant' : 'Sign in to chat with Dr. Jenab\'s AI assistant for educational health information'}
            </p>
            <div className="card-arrow">→</div>
          </div>

          <div className="glass-card nav-card" data-page="testimonials" data-color="#fff9e6">
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </div>
            <h3 className="card-title">Patient Experience</h3>
            <p className="card-description">4.7-star rating from patients and testimonials about integrative care</p>
            <div className="card-arrow">→</div>
          </div>
        </main>

        {/* Quick Contact Section */}
        <footer className="quick-contact">
          <div className="glass-card contact-card">
            <div className="contact-content">
              <h3>Schedule an Appointment</h3>
              <p>UCI Health Susan Samueli Integrative Health Institute</p>
              <div className="contact-buttons">
                <a href="tel:949-824-7000" className="glass-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  (949) 824-7000
                </a>
                <a href="https://www.ucihealth.org/find-a-doctor/j/arvin-jenab" className="glass-button" target="_blank">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 6h13"></path>
                    <path d="M8 12h13"></path>
                    <path d="M8 18h13"></path>
                    <path d="M3 6h.01"></path>
                    <path d="M3 12h.01"></path>
                    <path d="M3 18h.01"></path>
                  </svg>
                  Book Online
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}