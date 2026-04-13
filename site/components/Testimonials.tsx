const testimonials = [
  {
    quote: 'Testimonial coming soon — this slot is reserved for a client review.',
    name: 'Client Name',
    company: 'Company',
    placeholder: true,
  },
  {
    quote: 'Testimonial coming soon — this slot is reserved for a client review.',
    name: 'Client Name',
    company: 'Company',
    placeholder: true,
  },
  {
    quote: 'Testimonial coming soon — this slot is reserved for a client review.',
    name: 'Client Name',
    company: 'Company',
    placeholder: true,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#0a0e1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            What Clients Say
          </h2>
          <p className="text-gray-400 text-lg">
            Testimonials will appear here as projects complete.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-dashed border-gray-700 bg-[#111827]/50"
            >
              <div className="text-3xl text-gray-700 mb-4">&ldquo;</div>
              <p className="text-gray-500 italic text-sm mb-6 leading-relaxed">{t.quote}</p>
              <div>
                <div className="text-gray-600 font-semibold text-sm">{t.name}</div>
                <div className="text-gray-700 text-xs">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
