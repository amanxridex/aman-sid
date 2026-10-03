'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import rakshakLogo from '../../public/rakshaklogo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Why Rakshak', href: '/why-rakshak' },
    { label: 'Developers', href: '/developers' },
    { label: 'Grants & Registry', href: '/grants' },
    { label: 'Features', href: '/features' },
    { label: 'Live Radar', href: '/radar' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Founders', href: '/founders' },
    { label: 'Docs', href: '/docs' },
    { label: 'Download', href: '/download' },
  ];

  return (
    <>
      <nav className={`navbar-deepip ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container-deepip">
          <Link href="/" className="brand-independent" title="Rakshak Sovereign Defense — Home">
            <Image 
              src={rakshakLogo} 
              alt="Rakshak Crest Emblem" 
              width={36} 
              height={36} 
              className="brand-independent-logo" 
              priority
            />
            <span className="brand-independent-text">Rakshak</span>
          </Link>

          <ul className="nav-links-deepip">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={pathname === item.href ? 'active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link 
              href="/status" 
              className="nav-actions-mobile-hide" 
              style={{ 
                color: pathname === '/status' ? '#30d158' : '#86868b', 
                fontSize: '0.85rem', 
                fontWeight: 500, 
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.45rem',
                transition: 'color 0.15s ease'
              }}
              title="System Status — 99.99% Uptime"
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} />
              99.99% Uptime
            </Link>
            <Link 
              href="/download" 
              className="btn-deepip-blue nav-actions-mobile-hide" 
              style={{ padding: '0.55rem 1.4rem', fontSize: '0.875rem', minHeight: 40, display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              Get Shield
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button 
              className="mobile-nav-toggle"
              aria-label="Toggle Mobile Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link 
          href="/download" 
          className="btn-deepip-blue"
          style={{ width: '100%', marginTop: '1rem', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setMobileOpen(false)}
        >
          Get Shield — Single Workstation
        </Link>
      </div>
    </>
  );
}


