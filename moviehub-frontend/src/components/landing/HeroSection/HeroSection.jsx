const highlights = ['4K Screenings', 'VIP Seats', 'Instant Booking'];
const filterOptions = ['Today', 'This weekend', 'Nairobi', 'Now showing'];

function HeroSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Discover unforgettable movies
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Find blockbusters, indie films, and cult classics. Buy tickets and book your seats in seconds.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-3xl">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search movies, cinemas, or actors..."
              className="flex-1 rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-slate-400 backdrop-blur transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <button className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:shadow-lg hover:shadow-purple-500/40">
              Search
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {filterOptions.map((option) => (
              <button key={option} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-white/40 hover:bg-white/10 hover:text-white">
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Your next favorite movie starts here</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <span key={item} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/30">
            <img src="https://picsum.photos/600/400?random=7" alt="Neon Skyline" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-[-3rem] right-[-2rem] h-44 w-44 rounded-full bg-white/20 blur-3xl" />
            <div className="relative flex min-h-[320px] flex-col justify-end p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">Now streaming</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">Neon Skyline</h3>
              <p className="mt-2 text-white/90">Action • Adventure • Sci-Fi</p>
              <div className="mt-4 flex gap-4 text-sm font-semibold text-white">
                <span>⭐ 4.8</span>
                <span>2h 14m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
