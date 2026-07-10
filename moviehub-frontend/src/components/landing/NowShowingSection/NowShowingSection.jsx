const movies = [
  { title: 'Neon Skyline', genre: 'Sci-Fi', time: '7:30 PM' },
  { title: 'Midnight Circuit', genre: 'Thriller', time: '8:45 PM' },
  { title: 'Golden Hour', genre: 'Drama', time: '6:15 PM' }
];

function NowShowingSection() {
  return (
    <section id="now-showing" className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Now Showing</h2>
          <a href="#" className="text-sm font-medium text-cyan-300">View all</a>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {movies.map((movie) => (
            <article key={movie.title} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20">
              <div className="h-44 bg-gradient-to-br from-pink-500/90 via-fuchsia-500/70 to-cyan-400/60" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{movie.genre}</p>
                <span className="mt-3 inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">{movie.time}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NowShowingSection;
