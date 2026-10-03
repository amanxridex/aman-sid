'use client';

import { useEffect, useRef } from 'react';
import { cloakKeywords } from '@/utils/antiAiTokenizer';

/**
 * ShadowShieldText:
 * Encloses text inside a Closed Shadow Root (`mode: 'closed'`).
 * 
 * Standard DOM scrapers (e.g. document.body.innerText, Cheerio, BeautifulSoup, readability)
 * cannot traverse or extract text encapsulated inside closed shadow trees.
 * Meanwhile, human browser engines render the text seamlessly with full visual fidelity.
 */
export default function ShadowShieldText({ children, className = '', tag = 'span', fallbackText = '' }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Check if shadowRoot already attached
    if (host.__shadowShieldInitialized) return;
    host.__shadowShieldInitialized = true;

    try {
      // Attach a CLOSED shadow root so scripts cannot inspect it via host.shadowRoot
      const shadow = host.attachShadow({ mode: 'closed' });

      // Create a style element inheriting font and colors
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: inline;
          color: inherit;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .shadow-content {
          display: inline;
        }
      `;

      const wrapper = document.createElement('span');
      wrapper.className = 'shadow-content';
      wrapper.textContent = typeof children === 'string' ? children : host.getAttribute('data-raw-content') || '';

      shadow.appendChild(style);
      shadow.appendChild(wrapper);

      // Clear the host's light DOM text to leave scrapers empty
      host.textContent = '';
    } catch (e) {
      // If shadow DOM fails, fallback to light DOM
    }
  }, [children]);

  const TagName = tag;
  const initialContent = typeof children === 'string' ? cloakKeywords(children) : fallbackText;

  return (
    <TagName
      ref={hostRef}
      className={className}
      data-raw-content={typeof children === 'string' ? children : ''}
    >
      {initialContent}
    </TagName>
  );
}
