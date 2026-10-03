'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }) {
  const progressBarRef = useRef(null);
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-grade exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && progressBarRef.current) {
        const progress = Math.min(100, Math.max(0, (scrollY / total) * 100));
        progressBarRef.current.style.width = `${progress}%`;
      }
    };

    lenis.on('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    const timer = setTimeout(() => {
      const targets = document.querySelectorAll(
        '.deepip-card, .stat-card-deepip, .section-header-deepip, .deepip-window-frame, .stage_tab-menu, .tech-tag, [data-scroll-reveal]'
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const parent = el.parentElement;
              if (parent) {
                const siblings = Array.from(parent.children);
                const idx = siblings.indexOf(el);
                if (idx > 0 && idx < 8) {
                  el.style.transitionDelay = `${idx * 65}ms`;
                }
              }
              el.classList.add('is-revealed');
              observer.unobserve(el);
            }
          });
        },
        {
          rootMargin: typeof window !== 'undefined' && window.innerWidth < 768 ? '0px 0px -25px 0px' : '0px 0px -45px 0px',
          threshold: 0.08,
        }
      );

      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 30) {
          el.classList.add('is-revealed');
        } else {
          el.classList.add('scroll-reveal');
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }, 70);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <div ref={progressBarRef} className="scroll-progress-bar" aria-hidden="true" />
      {children}
    </>
  );
}
