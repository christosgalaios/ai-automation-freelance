const stats = [
  { value: '110+', label: 'MCP Tools Built' },
  { value: '14', label: 'Production Modules' },
  { value: '6,300+', label: 'Test Assertions' },
  { value: 'IEEE', label: 'Published' },
  { value: '1st Class', label: 'Honours' },
];

export default function ProofBar() {
  return (
    <section className="bg-[#111827] border-y border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
