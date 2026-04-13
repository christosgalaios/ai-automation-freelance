'use client';

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-md border-b border-gray-800/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-bold text-white text-base tracking-tight">
          Christos<span className="text-brand-400">.</span>
        </a>
        <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <a
            href="https://www.upwork.com/freelancers/christosgalaios"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-md bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
}
