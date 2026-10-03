import Image from 'next/image';

export default function Testimonials() {
  const reviews = [
    {
      author: 'Jason Christie',
      role: 'Lead Security Engineer',
      text: '"Rakshak prevented background desktop AI indexers from harvesting our proprietary source code. The kernel isolation is flawless and light."',
      company: 'Apex Security Labs'
    },
    {
      author: 'Aarav Sharma',
      role: 'Full Stack Architect',
      text: '"The developer experience is clean, zero overhead, and the live threat console gives full transparency into blocked PIDs."',
      company: 'HyperScale Tech'
    },
    {
      author: 'Elena Rostova',
      role: 'Privacy Researcher',
      text: '"As a privacy team lead, Rakshak\'s honeypot noise generator is revolutionary. It poisons unauthorized scrapers effortlessly."',
      company: 'Privacy Watch EU'
    },
    {
      author: 'Michael Chen',
      role: 'DevOps Director',
      text: '"Our local workstation file security jump-started by 95% thanks to Rakshak. Setup took less than 60 seconds with winget."',
      company: 'CloudVector Inc'
    },
    {
      author: 'Sophia Lin',
      role: 'Cyber Analyst',
      text: '"The intuitive zero-trust rules make local AI firewall management effortless. I can finally code without worrying about background model scrapers."',
      company: 'ZeroPoint Defense'
    },
    {
      author: 'David Vance',
      role: 'Startup Founder',
      text: '"Working with Rakshak turned our engineer laptop fleet into a hardened vault. Must-have software for any engineering team in 2026."',
      company: 'AeroForge Labs'
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-header-deepip">
          <div className="tag_content">
            <div className="blue_tag">REVIEWS</div>
            <span>Verified Engineer Feedback</span>
          </div>
          <h2>What Our Users Are Saying</h2>
          <p>Read how privacy-conscious developers, security engineers, and founders protect their local files with Rakshak.</p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-card">
              <div>
                <div className="testimonial-author">{rev.author}</div>
                <div className="testimonial-role">{rev.role}</div>
                <p className="testimonial-text">{rev.text}</p>
              </div>
              <div className="testimonial-brand">
                <Image src="/assets/logo.png" alt="Logo" width={16} height={16} />
                <span>{rev.company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
