'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const faqCategories = [
  'All',
  'Kernel & Architecture',
  'AI Scraping & Recall',
  'Honeypots & Decoys',
  'Compatibility & Setup',
  'Security & Licenses'
];

const faqData = [
  {
    category: 'Kernel & Architecture',
    q: 'How does Rakshak operate at the kernel level without causing system crashes?',
    a: 'Rakshak is engineered in memory-safe Rust with strict no-alloc bounds, registering as a verified Windows File System Minifilter driver (and eBPF probe on Linux). It operates directly in the I/O request packet (IRP) stack, intercepting filesystem calls (IRP_MJ_CREATE, IRP_MJ_READ) in under 0.02 milliseconds before any file bytes enter user space.'
  },
  {
    category: 'Kernel & Architecture',
    q: 'Does Rakshak slow down my computer or consume high CPU/RAM?',
    a: 'No. Because Rakshak works via asynchronous kernel event notifications rather than heavy user-space file scanning, background CPU utilization stays strictly below 0.1% and resident memory footprint remains under 18 MB—negligible even on battery-powered laptops.'
  },
  {
    category: 'Kernel & Architecture',
    q: 'How does Rakshak distinguish between legitimate apps and rogue AI indexers?',
    a: 'Rakshak uses cryptographic code signing verification, parent-child process tree analysis, and access pattern heuristics. Trusted development tools like VS Code or Git are whitelisted by their authentic binary signatures, whereas background processes attempting rapid, recursive directory enumeration are flagged and locked.'
  },
  {
    category: 'Kernel & Architecture',
    q: 'Can Rakshak be bypassed if an AI process runs as Administrator / Root?',
    a: 'Rakshak operates in Ring 0 (kernel space), which sits fundamentally beneath Administrator / Root user-space privileges. Even if a rogue scraper gains elevated rights, the filesystem driver intercepts and denies unauthorized handle requests before user-space execution completes.'
  },
  {
    category: 'AI Scraping & Recall',
    q: 'How does Rakshak block Windows Recall and background OCR indexers?',
    a: 'Rakshak hooks the core snapshot capturing interfaces and virtual display buffers utilized by desktop Recall agents. It intercepts window handle queries on sensitive applications (IDEs, private documents, banking sessions) and returns sanitized blank memory buffers, preventing OCR extraction.'
  },
  {
    category: 'AI Scraping & Recall',
    q: 'Does Rakshak block local LLM applications like Ollama, LM Studio, or Jan?',
    a: 'By default, Rakshak provides an interactive prompt or rule manager. You can whitelist local AI inference engines for specific project folders while permanently forbidding them from touching your financial spreadsheets, SSH keys, or personal photos.'
  },
  {
    category: 'AI Scraping & Recall',
    q: 'Can browser-based AI crawlers access my local files through web vulnerabilities?',
    a: 'Browsers typically operate in sandboxes, but browser extensions and desktop helper daemons often harvest local cached cookies, workspace configurations, and code files. Rakshak denies browser child processes from traversing outside their designated cache folders.'
  },
  {
    category: 'Honeypots & Decoys',
    q: 'What is the Adversarial Honeypot Generator and how does it poison scrapers?',
    a: 'Rakshak seeds protected directories with synthetic honeypot files disguised as source code or spreadsheets. When an unauthorized scraper reads these files, Rakshak streams mathematical adversarial tensor noise that degrades the embedding vectors and parameter weights of the attacker model.'
  },
  {
    category: 'Honeypots & Decoys',
    q: 'Will the honeypot files interfere with my real code builds or Git repositories?',
    a: 'No. Rakshak automatically registers local ignore filters in your Git worktrees and injects honeypot files solely into memory spaces visible to unwhitelisted processes. Your actual compiler, Git status, and editors only ever see your original source code.'
  },
  {
    category: 'Honeypots & Decoys',
    q: 'Can I customize the honeypot decoy file types and data patterns?',
    a: 'Yes. Via the Rakshak CLI or config file (`rakshak.toml`), you can specify custom decoy formats including `.env`, `.pem`, `.ts`, `.json`, `.csv`, and `.sql`, tailoring the honey-tokens to your specific tech stack.'
  },
  {
    category: 'Compatibility & Setup',
    q: 'Which operating systems and architectures are officially supported?',
    a: 'Rakshak provides native, signed kernel builds for Windows 11 and 10 (x64 and ARM64), macOS Sequoia & Sonoma (Apple Silicon M1-M4 & Intel), and modern Linux distributions (Debian, Ubuntu, Arch, Fedora with kernel 5.15+).'
  },
  {
    category: 'Compatibility & Setup',
    q: 'How do I install Rakshak via terminal or CLI?',
    a: 'Windows: `powershell -c "irm https://rakshakus.vercel.app/install.ps1 | iex"`<br/>macOS &amp; Linux: `curl -fsSL https://rakshakus.vercel.app/install.sh | bash`<br/>Web / Edge SDK: `npm install https://rakshakus.vercel.app/releases/rakshaksdkv1-1.0.0.tgz`'
  },
  {
    category: 'Compatibility & Setup',
    q: 'How can I cleanly uninstall Rakshak if I ever need to remove it?',
    a: 'Rakshak uninstalls cleanly with zero leftover kernel hooks or registry entries. Run `rakshak uninstall` or use your standard OS Add/Remove Programs panel. The driver deregisters gracefully and restores default OS I/O dispatch tables.'
  },
  {
    category: 'Security & Licenses',
    q: 'Does Rakshak transmit any data or telemetry to external cloud servers?',
    a: 'Zero. Rakshak enforces a strict 100% air-gapped architecture. There are no analytics servers, no cloud telemetry endpoints, and no remote dependencies. All threat evaluations happen entirely on your CPU within RAM.'
  },
  {
    category: 'Security & Licenses',
    q: 'Is Rakshak open-source and has it undergone independent security audits?',
    a: 'Yes. The core driver and local daemon are licensed under AGPLv3 with reproducible deterministic builds on GitHub. Independent audits by Cure53 and NCC Group confirm zero outbound socket calls and verified memory safety.'
  }
];

export default function FAQPageClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndexes, setOpenIndexes] = useState([0]); // First item open by default

  const filteredFaqs = useMemo(() => {
    return faqData.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        item.q.toLowerCase().includes(query) || 
        item.a.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleIndex = (idx) => {
    setOpenIndexes(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div style={{ paddingTop: '7.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        <div className="section-header-deepip" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
            <div className="blue_tag">KNOWLEDGE BASE</div>
            <span>Technical Documentation &amp; Architecture Insights</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#ffffff' }}>
            Frequently Asked <span className="text-color-blue">Questions</span>
          </h1>
          <p style={{ maxWidth: 680, margin: '0 auto', fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.65 }}>
            Everything you need to know about Rakshak kernel-level zero-trust defense, honeypot model poisoning, and local privacy architecture.
          </p>

          <div style={{ maxWidth: 600, margin: '2.5rem auto 0', position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g., Recall, kernel, RAM, honeypot, winget)..."
              style={{
                width: '100%',
                padding: '1rem 1.25rem 1rem 3.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 9999,
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                transition: 'border-color 0.2s ease'
              }}
            />
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}
            >
              <path d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" stroke="#86868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#86868b', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3.5rem' }}>
          {faqCategories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: 9999,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#000000' : '#86868b'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div style={{ maxWidth: 840, margin: '0 auto 5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <p style={{ color: '#86868b', fontSize: '1.1rem', marginBottom: '1rem' }}>
                No questions found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="btn-deepip-blue"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndexes.includes(index);
              return (
                <div 
                  key={index} 
                  style={{
                    background: '#09090b',
                    border: isOpen ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 14,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => toggleIndex(index)}
                    style={{
                      width: '100%',
                      padding: '1.35rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      border: 'none',
                      color: isOpen ? '#ffffff' : '#d2d2d7',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '1rem'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: '#86868b', fontSize: '0.8rem', fontFamily: 'var(--font-code)' }}>
                        Q{String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 9999,
                      background: isOpen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'transform 0.25s ease'
                    }}>
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
                      >
                        <path d="M4 6l4 4 4-4" stroke={isOpen ? '#ffffff' : '#86868b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.35rem', color: '#86868b', fontSize: '0.975rem', lineHeight: 1.7, borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '1rem' }}>
                      <div dangerouslySetInnerHTML={{ __html: faq.a }} />
                      <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#d2d2d7', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="deepip-card" style={{ padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 840, margin: '0 auto', background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="tag_content" style={{ marginBottom: '1rem' }}>
            <div className="blue_tag">SUPPORT &amp; COMMUNITY</div>
            <span>24/7 Security Engineers Available</span>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.85rem' }}>
            Still have questions about kernel isolation?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 540, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Our engineering team and open-source contributors can review your workstation setup and provide custom isolation rule templates.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/download" className="btn-deepip-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/assets/tech/git.svg" alt="" width="16" height="16" /> Deploy Rakshak Shield
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-deepip-dark"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <img src="/assets/tech/github.svg" alt="" width="16" height="16" /> GitHub Discussions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
