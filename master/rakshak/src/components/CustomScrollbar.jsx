'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function CustomScrollbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down'); // 'up' | 'down'
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const pathname = usePathname();

  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const thumbHeight = 28; // height of the blue arrow button in px

  const updateScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 10) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);

    // Calculate progress (0 to 1)
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
    setScrollProgress(progress);

    // Synchronous DOM update for instantaneous real-time movement (zero lag)
    if (thumbRef.current) {
      const topPx = progress * (clientHeight - thumbHeight);
      thumbRef.current.style.transform = `translate3d(0, ${topPx}px, 0)`;
    }

    // Determine direction on up and down scroll
    const delta = scrollY - lastScrollYRef.current;
    if (Math.abs(delta) > 1) {
      setScrollDirection(delta > 0 ? 'down' : 'up');
      lastScrollYRef.current = scrollY;
    }
  }, [thumbHeight]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    // Direct synchronous scroll listener for immediate tracking
    const onScroll = () => {
      updateScroll();
    };

    updateScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Listen to Lenis smooth scroll if active
    const checkLenis = () => {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.on('scroll', onScroll);
      }
    };
    checkLenis();
    const timer = setTimeout(checkLenis, 200);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.off('scroll', onScroll);
      }
      clearTimeout(timer);
    };
  }, [updateScroll, pathname]);

  // Click on track to jump/scroll
  const handleTrackClick = (e) => {
    if (e.target.closest('.custom-scrollbar-thumb')) return;
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const availableHeight = rect.height - thumbHeight;
    const ratio = Math.min(1, Math.max(0, clickY / availableHeight));

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const targetScroll = ratio * (scrollHeight - clientHeight);

    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(targetScroll);
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Drag thumb handler
  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const startY = e.clientY;
    const startScroll = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;
    const availableHeight = clientHeight - thumbHeight;

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const scrollDelta = (deltaY / availableHeight) * maxScroll;
      const newScroll = Math.min(maxScroll, Math.max(0, startScroll + scrollDelta));

      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.scrollTo(newScroll, { immediate: true });
      } else {
        window.scrollTo({ top: newScroll, behavior: 'instant' });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleThumbTouchStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);

    const startY = e.touches[0].clientY;
    const startScroll = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;
    const availableHeight = clientHeight - thumbHeight;

    const handleTouchMove = (moveEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaY = moveTouch.clientY - startY;
      const scrollDelta = (deltaY / availableHeight) * maxScroll;
      const newScroll = Math.min(maxScroll, Math.max(0, startScroll + scrollDelta));

      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.scrollTo(newScroll, { immediate: true });
      } else {
        window.scrollTo({ top: newScroll, behavior: 'instant' });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={trackRef}
      className="custom-scrollbar-track"
      onClick={handleTrackClick}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '20px',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    >
      {/* Sleek Minimal Guide Rail (Zero glow, flat hairline) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* Blue Arrow Scroll Indicator Button (Strictly ZERO GLOW, follows continuously with user) */}
      <div
        ref={thumbRef}
        className="custom-scrollbar-thumb"
        onMouseDown={handleThumbMouseDown}
        onTouchStart={handleThumbTouchStart}
        style={{
          position: 'absolute',
          top: 0,
          left: '2px',
          transform: `translate3d(0, ${scrollProgress * (typeof window !== 'undefined' ? window.innerHeight - thumbHeight : 0)}px, 0)`,
          width: '16px',
          height: `${thumbHeight}px`,
          background: '#000000',
          border: '1px solid #0071e3', // Crisp Apple blue hairline, strictly NO glow
          borderRadius: '3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          boxShadow: 'none',
          filter: 'none',
          transition: 'none', // Strictly NO transition delay so it moves continuously in lockstep
          willChange: 'transform',
        }}
        title={`Scroll: ${Math.round(scrollProgress * 100)}%`}
      >
        {/* Crisp Blue Arrow - Rotates to point DOWN or UP */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0071e3" // Pure crisp blue
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: `rotate(${scrollDirection === 'up' ? 180 : 0}deg)`,
            transition: 'transform 0.12s ease-out',
            filter: 'none',
          }}
        >
          <line x1="12" y1="4" x2="12" y2="20" />
          <polyline points="19 13 12 20 5 13" />
        </svg>
      </div>
    </div>
  );
}
