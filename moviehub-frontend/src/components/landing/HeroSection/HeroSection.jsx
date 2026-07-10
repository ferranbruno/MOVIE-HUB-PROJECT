const highlights = ['4K Screenings', 'VIP Seats', 'Instant Booking'];

function HeroSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Your next favorite movie starts here</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Discover blockbuster films and reserve your perfect seat.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Explore new releases, trending cinema, and premium showtimes from one sleek experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#now-showing" className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-500/20">
              Browse Movies
            </a>
            <a href="#trending" className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur">
              See Trending
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <li key={item} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-pink-500/90 via-fuchsia-500/70 to-cyan-400/60 p-6 shadow-2xl shadow-black/30">
          <div className="absolute bottom-[-3rem] right-[-2rem] h-44 w-44 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex min-h-[320px] flex-col justify-end">
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
    </section>
  );
}

export default HeroSection;
