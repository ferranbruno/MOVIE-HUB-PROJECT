const trendingItems = [
  { title: 'Aurora Drift', tag: 'Fantasy' },
  { title: 'Shadow District', tag: 'Mystery' },
  { title: 'Echoes of Tomorrow', tag: 'Adventure' }
];

function TrendingSection() {
  return (
    <section id="trending" className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Trending Now</h2>
          <a href="#" className="text-sm font-medium text-cyan-300">Explore more</a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {trendingItems.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-cyan-400/10 p-5">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{item.tag}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingSection;
