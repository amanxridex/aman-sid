'use client';

import { useEffect, useRef } from 'react';
import { cloakKeywords } from '@/utils/antiAiTokenizer';

export default function ShadowShieldText({ children, className = '', tag = 'span', fallbackText = '' }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (host.__shadowShieldInitialized) return;
    host.__shadowShieldInitialized = true;

    try {
      const shadow = host.attachShadow({ mode: 'closed' });

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

      host.textContent = '';
    } catch (e) {
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
