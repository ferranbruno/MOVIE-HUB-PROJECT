function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3 font-semibold tracking-[0.2em] text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 text-sm font-bold text-slate-950">
            ▶
          </span>
          <span>MovieHub</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#browse" className="transition hover:text-white">Browse movies</a>
          <a href="#now-showing" className="transition hover:text-white">Now showing</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#login" className="text-sm font-semibold text-slate-300 transition hover:text-white">
            Login
          </a>
          <a href="#signup" className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/20">
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
