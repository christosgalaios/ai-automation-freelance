const links = [
  {
    label: 'Email',
    value: 'christos.galaios@gmail.com',
    href: 'mailto:christos.galaios@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: 'Upwork',
    value: 'upwork.com/freelancers/christosgalaios',
    href: 'https://www.upwork.com/freelancers/christosgalaios',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H8.848v7.184c-.002 1.346-1.103 2.445-2.449 2.445-1.346 0-2.445-1.099-2.447-2.445V3.492H2.236v7.184c0 2.673 2.173 4.846 4.845 4.846 2.67 0 4.846-2.173 4.846-4.846v-1.203c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h1.773l1.213-5.71c1.063.679 2.285 1.109 3.547 1.109 3.096 0 5.092-2.08 5.092-5.079-.001-2.96-2.348-5.34-5.092-5.34z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/christosgalaios',
    href: 'https://github.com/christosgalaios',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/christosgalaios',
    href: 'https://www.linkedin.com/in/christosgalaios',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#111827]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Ready to automate? Let&apos;s talk.
        </h2>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          Tell me what you want to automate. I&apos;ll tell you whether I can help and what it
          would take — usually within 24 hours.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-[#0a0e1a] hover:border-brand-700 text-gray-300 hover:text-white transition-colors duration-200 group"
            >
              <span className="text-brand-400 group-hover:text-brand-300 transition-colors">
                {link.icon}
              </span>
              <div className="text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">
                  {link.label}
                </div>
                <div className="text-sm font-medium truncate">{link.value}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-gray-600 text-sm">
          Based in Bristol, UK &mdash; working with clients worldwide
        </div>
      </div>
    </section>
  );
}
