import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const BRAND_ICONS = [
  {
    color: 'bg-iris-violet',
    // Message/Speech bubble icon
    svg: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pitch-black" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
      </svg>
    )
  },
  {
    color: 'bg-toxic-green',
    // Check mark / shield icon
    svg: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pitch-black" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
      </svg>
    )
  },
  {
    color: 'bg-ember-orange',
    // Spark/Lightning icon
    svg: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pitch-black" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c0 .83.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5v-3c4.69 0 8.5-3.81 8.5-8.5S20.69 2 16 2h-4.5zm2.5 11.5H9.5v-2h4.5v2zm2-4H8.5v-2h7.5v2z"/>
      </svg>
    )
  },
  {
    color: 'bg-schoolbus-yellow',
    // Lock icon
    svg: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pitch-black" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
    )
  },
  {
    color: 'bg-cobalt-blue',
    // Bar chart icon
    svg: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pitch-black" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
      </svg>
    )
  }
];

const FAQS = [
  {
    question: "How do I file a new complaint?",
    answer: "Simply log in to your student account, click on 'Submit Complaint' from the sidebar, fill out the form fields (Title, Category, Location, and Description) and hit submit. The administration will receive it instantly."
  },
  {
    question: "Who reviews my submissions?",
    answer: "All complaints are routed directly to the campus administration desk. They categorize the severity and assign the complaint to the respective engineering or service departments (e.g. IT support, facilities, electrical dept)."
  },
  {
    question: "Can I edit a complaint after filing it?",
    answer: "Yes, you can edit the details of your complaint as long as it is still in the 'Pending' status. Once a staff member starts working on it (status changes to 'In Progress' or 'Resolved'), edits are locked to prevent workflow disruption."
  },
  {
    question: "Is my identity visible to everyone?",
    answer: "Your identity is visible only to the administrators and engineers resolving your issue to facilitate official communication. It is not shared publicly with other students."
  }
];

// Reusable IntersectionObserver Scroll Reveal wrapper
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [themeDark, setThemeDark] = useState(true);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={`min-h-screen ${themeDark ? 'bg-pitch-black text-warm-cream' : 'bg-warm-cream text-pitch-black'} transition-colors duration-500`}>
      
      {/* 1. HERO BAND (Dark) */}
      <section className="min-h-[90vh] flex flex-col justify-between px-6 pt-32 pb-16 bg-pitch-black text-warm-cream relative overflow-hidden">
        
        {/* Giant Outlined background text (Parallax / Retro Graphic feel) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.02] z-0">
          <span 
            className="text-[25vw] font-black font-oldschoolgrotesk uppercase tracking-tighter"
            style={{ WebkitTextStroke: '3px #fdf9f0', color: 'transparent' }}
          >
            BANANANA
          </span>
        </div>

        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        {/* Floating Brand Elements */}
        <div className="max-w-6xl mx-auto w-full text-center flex-1 flex flex-col justify-center items-center z-10">
          <Reveal delay={100} className="mb-6 flex justify-center items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-acid-lime animate-ping" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-acid-lime font-aeonik">CAMPUS REGISTRY V2</span>
          </Reveal>
 
          <Reveal delay={200}>
            <h1 className="text-7xl sm:text-[120px] md:text-[145px] font-black uppercase tracking-[-0.04em] leading-[0.8] font-oldschoolgrotesk select-none text-warm-cream">
              BANA<br />
              <span className="text-acid-lime hover:text-warm-cream transition-colors duration-300 cursor-default">nana</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-8 text-sm sm:text-base text-warm-cream/60 max-w-lg mx-auto tracking-wide leading-relaxed font-aeonik font-light">
              A high-contrast grotesque complaint board. Submit reports, track department progress in real-time, and make your voice count.
            </p>
          </Reveal>

          <Reveal delay={400} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto rounded-full bg-acid-lime px-8 py-3.5 text-xs font-bold tracking-[0.2em] text-pitch-black hover:bg-lime-300 hover:scale-105 active:scale-95 transition-all uppercase text-center cursor-pointer shadow-sm duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto rounded-full border-2 border-acid-lime text-acid-lime hover:bg-acid-lime hover:text-pitch-black hover:scale-105 active:scale-95 px-8 py-3 text-xs font-bold tracking-[0.2em] transition-all duration-300 uppercase text-center cursor-pointer"
            >
              Sign In ↗
            </Link>
          </Reveal>
        </div>

        {/* Quintet Brand Icons Row (with dynamic hover effects) */}
        <Reveal delay={500} className="w-full max-w-xl mx-auto mt-16 z-10">
          <div className="flex justify-between items-center gap-3 sm:gap-4">
            {BRAND_ICONS.map((icon, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[25px] ${icon.color} flex items-center justify-center border-2 border-pitch-black hover:scale-110 hover:-rotate-3 hover:ring-4 hover:ring-acid-lime/50 transition-all duration-300 cursor-pointer group/tile`}
              >
                <div className="group-hover/tile:scale-110 group-hover/tile:rotate-6 transition-transform duration-300">
                  {icon.svg}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Scroll indicator micro-interaction */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-40 animate-bounce">
          <span className="text-[9px] font-bold tracking-[0.25em] text-warm-cream/40 uppercase font-aeonik">SCROLL</span>
          <svg className="w-3.5 h-3.5 text-acid-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 2. TRANSITION FEATURE BAND (Cream) */}
      <section className="bg-warm-cream text-pitch-black py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          
          <Reveal className="text-center mb-20 space-y-4">
            <span className="text-xs font-bold tracking-[0.25em] text-pitch-black/60 uppercase font-aeonik">FEATURES</span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.03em] uppercase leading-[0.85] font-oldschoolgrotesk">
              CAMPUS ISSUES<br />
              <span className="text-ember-orange">RESOLVED</span>
            </h2>
          </Reveal>

          {/* Staggered cards list using our observer */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <Reveal delay={100}>
              <div className="rounded-[25px] bg-pitch-black p-8 text-warm-cream border-2 border-charcoal-900 hover:border-acid-lime hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between min-h-[250px] group relative">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-acid-lime uppercase font-aeonik">STEP 01</span>
                  <h3 className="text-xl font-black uppercase tracking-tight mt-4 font-oldschoolgrotesk">Easy Reporting</h3>
                  <p className="mt-3 text-xs sm:text-sm text-warm-cream/70 leading-relaxed font-light font-aeonik">
                    Submit detailed descriptions, select categories, and pinpoint room/building locations in seconds.
                  </p>
                </div>
                <div className="text-right mt-6">
                  <span className="text-xl text-acid-lime font-mono inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
                </div>
              </div>
            </Reveal>

            {/* Feature 2 */}
            <Reveal delay={250}>
              <div className="rounded-[25px] bg-pitch-black p-8 text-warm-cream border-2 border-charcoal-900 hover:border-acid-lime hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between min-h-[250px] group relative">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-acid-lime uppercase font-aeonik">STEP 02</span>
                  <h3 className="text-xl font-black uppercase tracking-tight mt-4 font-oldschoolgrotesk">Real-time Tracking</h3>
                  <p className="mt-3 text-xs sm:text-sm text-warm-cream/70 leading-relaxed font-light font-aeonik">
                    Follow progress directly through interactive badges showing Pending, In Progress, or Resolved statuses.
                  </p>
                </div>
                <div className="text-right mt-6">
                  <span className="text-xl text-acid-lime font-mono inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
                </div>
              </div>
            </Reveal>

            {/* Feature 3 */}
            <Reveal delay={400}>
              <div className="rounded-[25px] bg-pitch-black p-8 text-warm-cream border-2 border-charcoal-900 hover:border-acid-lime hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between min-h-[250px] group relative">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-acid-lime uppercase font-aeonik">STEP 03</span>
                  <h3 className="text-xl font-black uppercase tracking-tight mt-4 font-oldschoolgrotesk">Analytics Board</h3>
                  <p className="mt-3 text-xs sm:text-sm text-warm-cream/70 leading-relaxed font-light font-aeonik">
                    Help administrators identify frequent hotspots and departments with delay bottlenecks.
                  </p>
                </div>
                <div className="text-right mt-6">
                  <span className="text-xl text-acid-lime font-mono inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Transition quintet at the bottom of Feature section */}
          <Reveal delay={200} className="w-full max-w-xl mx-auto mt-24">
            <div className="flex justify-between items-center gap-3 sm:gap-4">
              {BRAND_ICONS.map((icon, idx) => (
                <div
                  key={idx}
                  className={`w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-[25px] ${icon.color} flex items-center justify-center border-2 border-pitch-black hover:scale-110 hover:rotate-3 hover:ring-4 hover:ring-pitch-black transition-all duration-300 cursor-pointer group/tile`}
                >
                  <div className="group-hover/tile:scale-110 group-hover/tile:-rotate-6 transition-transform duration-300">
                    {icon.svg}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. FAQ ACCORDION BAND (Ember Orange) */}
      <section className="bg-ember-orange text-pitch-black py-28 px-6 relative">
        <div className="max-w-3xl mx-auto">
          
          <Reveal className="text-center mb-20 space-y-4">
            <div className="flex items-center justify-center gap-4 text-pitch-black/70">
              <span className="h-[2px] w-8 bg-current opacity-30" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase font-aeonik">FAQ</span>
              <span className="h-[2px] w-8 bg-current opacity-30" />
            </div>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.03em] uppercase leading-[0.85] font-oldschoolgrotesk">
              MOST COMMON<br />
              QUESTIONS
            </h2>
          </Reveal>

          {/* Accordion list */}
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Reveal key={idx} delay={idx * 100} className="space-y-2">
                  
                  {/* Question Pill */}
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between bg-pitch-black text-warm-cream rounded-[1000px] py-4.5 px-6.5 text-left text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-charcoal-900 transition-all duration-300 hover:scale-[1.01] cursor-pointer select-none"
                  >
                    <span>{faq.question}</span>
                    <span className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-acid-lime' : 'text-warm-cream/50'}`}>
                      ▼
                    </span>
                  </button>

                  {/* Expanded Answer Card (Smooth Grid Height Reveal Animation) */}
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
                    <div className="overflow-hidden">
                      <div className="bg-warm-cream text-pitch-black rounded-[25px] p-6 text-xs sm:text-sm font-medium leading-relaxed border border-pitch-black/10">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FOOTER / DECORATIVE BAR */}
      <footer className="bg-pitch-black text-warm-cream py-16 px-6 relative border-t border-charcoal-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-ember-orange flex items-center justify-center font-black text-pitch-black text-xs font-oldschoolgrotesk tracking-tighter">
              B
            </div>
            <span className="font-oldschoolgrotesk font-black text-sm tracking-wider text-warm-cream uppercase">
              BANANANA
            </span>
          </div>

          {/* Small brand icon lockup in footer */}
          <div className="flex items-center gap-2">
            {BRAND_ICONS.map((icon, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-[8px] ${icon.color} flex items-center justify-center border border-pitch-black/40 hover:scale-110 transition-transform duration-300 cursor-pointer`}
              >
                {React.cloneElement(icon.svg, { className: 'w-4 h-4 text-pitch-black' })}
              </div>
            ))}
          </div>

          <div className="text-xs text-warm-cream/40 font-aeonik font-light">
            © 2026 BANANANA campus registry. Designed for visual utility.
          </div>

          {/* Contrast Mode Theme Switcher Widget */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-widest text-warm-cream/40 uppercase font-aeonik">CONTRAST MODE</span>
            <button
              onClick={() => setThemeDark(!themeDark)}
              className="w-12 h-6 bg-charcoal-900 rounded-full p-0.5 flex items-center justify-between border border-charcoal-900/50 relative cursor-pointer"
            >
              <div className={`w-5 h-5 rounded-full bg-acid-lime transition-transform duration-300 ${themeDark ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;