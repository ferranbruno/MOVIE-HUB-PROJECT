import React from 'react';

const rows = ['A', 'B', 'C', 'D', 'E'];
const cols = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SeatSelector({ selectedSeats = [], onToggleSeat, occupied = [] }) {
	function isSelected(id) {
		return selectedSeats.includes(id);
	}

	function isOccupied(id) {
		return occupied.includes(id);
	}

	return (
		<div className="pt-2">
			<div className="mb-2 text-sm text-gray-700">Rows: A–E · Columns: 1–8</div>

			<div className="grid grid-cols-9 items-center gap-2">
				{/* top-left empty corner */}
				<div />
				{/* column headers */}
				{cols.map((c) => (
					<div key={`col-${c}`} className="text-center text-sm text-gray-600">
						{c}
					</div>
				))}

				{/* rows with row label + seats */}
				{rows.map((r) => (
					<React.Fragment key={r}>
						<div className="flex items-center justify-center font-medium">{r}</div>
						{cols.map((c) => {
							const id = `${r}${c}`;
							const occupiedFlag = isOccupied(id);
							const selectedFlag = isSelected(id);
							return (
								<button
									key={id}
									type="button"
									onClick={() => !occupiedFlag && onToggleSeat(id)}
									disabled={occupiedFlag}
									aria-pressed={selectedFlag}
									aria-label={`Seat ${id}`}
									className={`h-10 w-full rounded ${occupiedFlag ? 'bg-gray-300 cursor-not-allowed' : selectedFlag ? 'bg-green-600 text-white' : 'bg-gray-100'} text-sm`}
								>
									{id}
								</button>
							);
						})}
					</React.Fragment>
				))}
			</div>

			<div className="mt-2 text-sm text-gray-600">Click seats to select. Occupied seats are disabled.</div>
		</div>
	);
}
