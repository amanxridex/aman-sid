'use client';

import { useEffect } from 'react';

/**
 * Universal Bi-Directional Scroll Reveal Manager
 * Handles entrance animations on page load, reveals on scroll down,
 * reveals on scroll up, and proper re-reveals when scrolling back and forth.
 */
export default function ScrollRevealManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track scroll direction for directional glide physics
    let lastScrollY = window.scrollY;
    let ticking = false;
    document.documentElement.setAttribute('data-scroll-dir', 'down');

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY;
          if (Math.abs(diff) > 4) {
            const dir = diff > 0 ? 'down' : 'up';
            document.documentElement.setAttribute('data-scroll-dir', dir);
            lastScrollY = currentScrollY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver for elements entering / leaving the viewport
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          target.classList.add('is-visible');
        } else {
          // Off-screen reset: removes is-visible so when the user scrolls
          // back up or back down into view, the element smoothly reveals again
          target.classList.remove('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: [0, 0.05],
      rootMargin: '10px 0px 10px 0px'
    });

    // Select all reveal elements across the page
    const selector =
      '.scroll-reveal, .hero-anim-kicker, .hero-anim-title, .hero-anim-subtitle, .hero-anim-actions, .hero-anim-photo, .hero-scroll-cue';

    const observeAll = () => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (!el.hasAttribute('data-reveal-observed')) {
          el.setAttribute('data-reveal-observed', 'true');
          observer.observe(el);
        }
      });
    };

    // Activate scroll reveal system after DOM ready
    requestAnimationFrame(() => {
      document.body.classList.add('scroll-reveal-active');
      observeAll();
    });

    // Handle any dynamic DOM additions
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      mutationObserver.disconnect();
      document.body.classList.remove('scroll-reveal-active');
    };
  }, []);

  return null;
}
