import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

const CHATBOT_HIDE_ID = 'noupe-chatbot-hide';

/**
 * ChatbotManager
 *
 * The chatbot script lives in index.html (always loaded).
 * This component ONLY handles:
 *   1. Hide/show via CSS (display:none) based on localStorage
 *   2. A small ✕ cross button on the chatbot icon to turn it off
 *   3. Syncs with the Settings toggle via custom events
 *
 * Default: OFF
 */
function ChatbotManager() {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem('chatbotEnabled');
    return stored === null ? false : stored === 'true';
  });

  // Listen for changes from Settings toggle
  useEffect(() => {
    const handleToggle = () => {
      const stored = localStorage.getItem('chatbotEnabled');
      setEnabled(stored === null ? false : stored === 'true');
    };
    window.addEventListener('chatbotToggled', handleToggle);
    window.addEventListener('storage', (e) => {
      if (e.key === 'chatbotEnabled') handleToggle();
    });
    return () => window.removeEventListener('chatbotToggled', handleToggle);
  }, []);

  // Apply or remove the CSS hide
  useEffect(() => {
    if (enabled) {
      // Show: remove hide stylesheet
      const el = document.getElementById(CHATBOT_HIDE_ID);
      if (el) el.remove();
    } else {
      // Hide: inject hide stylesheet
      if (!document.getElementById(CHATBOT_HIDE_ID)) {
        const style = document.createElement('style');
        style.id = CHATBOT_HIDE_ID;
        style.textContent = `
          #noupe-chatbot,
          .noupe-chatbot,
          [id*="noupe"],
          div[class*="noupe"],
          iframe[src*="noupe"] {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Always inject position fix (lifted above bottom nav on mobile)
    if (!document.getElementById('noupe-chatbot-pos')) {
      const posStyle = document.createElement('style');
      posStyle.id = 'noupe-chatbot-pos';
      posStyle.textContent = `
        /*
         * IMPORTANT: Do NOT use [id*="noupe"] here — it matches
         * internal container elements and breaks the Noupe script's
         * own close button logic. Only target top-level selectors.
         */

        /* Mobile: lift above bottom nav, reduce chat size */
        @media (max-width: 1024px) {
          div[class*="noupe"] {
            bottom: 50px !important;
            right: 14px !important;
            left: auto !important;
            top: auto !important;
            z-index: 4050 !important;
          }
          /* Reduce the chat window size on mobile */
          iframe[src*="noupe"] {
            position: fixed !important;
            max-width: 300px !important;
            max-height: 400px !important;
            width: 85vw !important;
            height: 70vh !important;
            bottom: 50px !important;
            right: 14px !important;
            left: auto !important;
            top: auto !important;
            z-index: 4050 !important;
          }
        }

        /* Desktop: standard bottom-right */
        @media (min-width: 1024px) {
          div[class*="noupe"] {
            bottom: 20px !important;
            right: 20px !important;
            left: auto !important;
            top: auto !important;
            z-index: 45 !important;
          }
          iframe[src*="noupe"] {
            bottom: 20px !important;
            right: 20px !important;
            left: auto !important;
            top: auto !important;
            z-index: 45 !important;
          }
        }
      `;
      document.head.appendChild(posStyle);
    }
  }, [enabled]);

  // Cross button click → turn off chatbot, sync with Settings
  const handleClose = useCallback(() => {
    localStorage.setItem('chatbotEnabled', 'false');
    setEnabled(false);
    window.dispatchEvent(new Event('chatbotToggled'));
  }, []);

  // Only render the cross button when chatbot is visible
  if (!enabled) return null;

  return createPortal(
    <>
      <style>{`
        .bb-chatbot-close {
          position: fixed;
          z-index: 9999;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.75);
          color: #fff;
          font-size: 10px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s ease;
        }
        .bb-chatbot-close:hover {
          background: #dc2626;
          border-color: #dc2626;
          transform: scale(1.15);
        }
        @media (min-width: 1024px) {
          .bb-chatbot-close { bottom: 68px; right: 16px; }
        }
        @media (max-width: 1023px) {
          .bb-chatbot-close { bottom: 132px; right: 14px; }
        }
      `}</style>
      <button
        className="bb-chatbot-close"
        onClick={handleClose}
        aria-label="Turn off chatbot"
        title="Turn off chatbot"
      >
        ✕
      </button>
    </>,
    document.body
  );
}

export default ChatbotManager;
