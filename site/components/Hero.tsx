'use client';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0e1a]">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(54,98,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(54,98,255,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600 opacity-10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-700 bg-brand-950 text-brand-300 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          Available for new projects
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
            Christos
          </span>
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4">
          AI Automation Engineer
        </p>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          I build production MCP servers, multi-agent workflows, and Claude integrations
          that save businesses{' '}
          <span className="text-white font-semibold">20+ hours/week</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#portfolio"
            className="px-8 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-base transition-colors duration-200 shadow-lg shadow-brand-900/40"
          >
            View My Work
          </a>
          <a
            href="https://www.upwork.com/freelancers/christosgalaios"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-lg border border-gray-600 hover:border-brand-500 text-gray-200 hover:text-white font-semibold text-base transition-colors duration-200"
          >
            Hire Me on Upwork
          </a>
        </div>
      </div>
    </section>
  );
}
