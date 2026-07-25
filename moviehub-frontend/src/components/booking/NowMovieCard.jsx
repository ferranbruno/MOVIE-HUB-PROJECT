  import React from 'react';

export default function NowMovieCard({ movie = {}, showtime = null, selectedSeats = [] }) {
  return (
    <aside className="border rounded p-4 bg-white/5">
      {movie?.poster && (
        <img src={movie.poster} alt={movie.title} className="w-full rounded mb-3" />
      )}
      <h3 className="text-lg font-semibold">{movie?.title || 'Movie'}</h3>
      {movie?.tagline && <p className="text-sm text-gray-300">{movie.tagline}</p>}
      <div className="mt-2 text-sm text-gray-300">
        {showtime ? (
          <>
            <div>{new Date(showtime.startsAt).toLocaleString()}</div>
            <div className="text-xs text-gray-400">{showtime.cinemaName || showtime.room}</div>
          </>
        ) : (
          <div className="text-sm text-gray-400">Select a showtime to see details</div>
        )}
      </div>

      <div className="mt-3 text-sm">
        <div className="font-medium">Selected seats</div>
        {selectedSeats && selectedSeats.length ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {selectedSeats.map((s) => (
              <span key={s} className="px-2 py-1 bg-slate-700 rounded text-xs">{s}</span>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 mt-1">No seats selected</div>
        )}
      </div>

      <div className="mt-4">
        <button className="w-full px-3 py-2 bg-pink-500 text-white rounded">View movie</button>
      </div>
    </aside>
  );
}
