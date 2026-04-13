const services = [
  {
    icon: '⚙️',
    title: 'MCP Server Development',
    description:
      'Custom Model Context Protocol servers that connect Claude to your business tools. CRMs, databases, APIs — fully integrated.',
    price: 'From £500',
    tags: ['TypeScript', 'MCP SDK', 'Claude'],
  },
  {
    icon: '🔄',
    title: 'AI Workflow Automation',
    description:
      'End-to-end automation pipelines using Claude, n8n, Make.com, and custom TypeScript. Replace manual processes with intelligent agents.',
    price: 'From £750',
    tags: ['n8n', 'Make.com', 'TypeScript'],
  },
  {
    icon: '🤖',
    title: 'Multi-Agent Systems',
    description:
      'Autonomous agent architectures where multiple AI agents collaborate on complex tasks. Content pipelines, data processing, decision workflows.',
    price: 'From £1,000',
    tags: ['Multi-Agent', 'Claude', 'TypeScript'],
  },
  {
    icon: '💡',
    title: 'Claude Integration & Consulting',
    description:
      'Strategic AI integration into your existing stack. Architecture review, implementation, and deployment.',
    price: 'From £200/hr',
    tags: ['Consulting', 'Architecture', 'API'],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#0a0e1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Services</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Production-grade AI automation — from single integrations to full multi-agent architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative p-6 rounded-xl border border-gray-800 bg-[#111827] hover:border-brand-700 transition-colors duration-200"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-md bg-brand-950 text-brand-300 border border-brand-900 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-brand-400 font-bold text-base">{service.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
