import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-semibold tracking-[0.2em] text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 text-sm font-bold text-slate-950">
            ▶
          </span>
          <span>MovieHub</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#browse" className="transition hover:text-white">Browse movies</a>
          <Link to="/cinemas" className="transition hover:text-white">Now showing</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
