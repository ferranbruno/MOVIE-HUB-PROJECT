import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  Home, User, Building2, LogIn, UserPlus, ChevronLeft, Search, Flame,
} from 'lucide-react';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w92';

function SidebarSearch({ collapsed }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/movies`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const filtered = list
          .filter((m) => m.title?.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 6);
        setResults(filtered);
        setOpen(filtered.length > 0);
      } catch (err) {
        if (err.name !== 'AbortError') setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(movie) {
    setOpen(false);
    setQuery('');
    setResults([]);
    const showtime = movie.showtimes?.[0];
    if (showtime) {
      navigate(`/booking/${showtime.id}`);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  }

  return (
    <div className="relative">
      <div
        className={`mx-3 mb-2.5 flex items-center gap-2 rounded-md bg-neutral-900 px-2 py-1.5 text-neutral-500 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <Search size={14} className="flex-shrink-0" />
        {!collapsed && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to"
            className="flex-1 bg-transparent text-[12.5px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
          />
        )}
      </div>

      {open && !collapsed && (
        <div
          ref={dropdownRef}
          className="absolute left-3 right-3 top-full z-50 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-xl"
        >
          {loading && (
            <div className="px-3 py-2 text-[11px] text-neutral-500">Searching...</div>
          )}
          {!loading && results.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-neutral-300 transition hover:bg-neutral-800"
            >
              {m.poster_url && (
                <img src={m.poster_url} alt="" className="h-8 w-6 flex-shrink-0 rounded object-cover" />
              )}
              <span className="flex-1 truncate">{m.title}</span>
              {m.showtimes?.length > 0 && (
                <span className="text-[10px] text-cyan-400">{m.showtimes.length} showtime{m.showtimes.length > 1 ? 's' : ''}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItems({ collapsed }) {
  const { isAuthenticated } = useAuth();

  const items = [
    { icon: Home, label: 'Home', to: '/' },
    ...(isAuthenticated
      ? [
          { icon: User, label: 'Profile', to: '/profile' },
          { icon: Building2, label: 'Cinemas', to: '/cinemas' },
        ]
      : [
          { icon: LogIn, label: 'Sign in', to: '/login' },
          { icon: UserPlus, label: 'Sign up', to: '/signup' },
          { icon: Building2, label: 'Cinemas', to: '/cinemas' },
        ]),
  ];

  return items.map(({ label, icon: Icon, to }) => (
    <Link
      key={label}
      to={to}
      className={`group/item relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-neutral-400 transition hover:bg-neutral-900 hover:text-white ${
        collapsed ? 'justify-center px-2' : ''
      }`}
    >
      <Icon size={16} className="flex-shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-2.5 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[12px] text-white opacity-0 transition-opacity duration-100 group-hover/item:opacity-100">
          {label}
        </span>
      )}
    </Link>
  ));
}

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`group fixed left-0 top-0 bottom-0 z-40 hidden flex-col border-r border-white/10 bg-neutral-950 text-neutral-200 transition-all duration-300 lg:flex ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-neutral-950 text-neutral-200 shadow-sm transition-opacity duration-150 ${
          collapsed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          size={13}
          className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        />
      </button>

      <div className="flex items-center gap-2.5 px-3 py-3.5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
          <Flame size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <span className="text-[13px] font-semibold text-white">MovieHub</span>
            <span className="text-[11px] text-neutral-500">Your cinema guide</span>
          </div>
        )}
      </div>

      <SidebarSearch collapsed={collapsed} />

      <nav className="flex flex-col gap-0.5 px-2">
        <NavItems collapsed={collapsed} />
      </nav>
    </aside>
  );
}

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        {children}
      </div>
    </div>
  );
}
