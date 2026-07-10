import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { parseJSON } from '../../utils/fetchHelpers';

export default function ResetPassword() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token') || '';
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setMessage('');
		if (password !== confirm) return setError('Passwords do not match');
		setLoading(true);
		try {
			const res = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, password }),
			});
			const data = await parseJSON(res);
			if (!res.ok) throw new Error((data && (data.message || data._raw)) || 'Reset failed');
			setMessage(data.message || 'Password has been reset. You may now sign in.');
			setTimeout(() => navigate('/login'), 2000);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
			<div className="bg-slate-900/60 backdrop-blur rounded-lg p-8 w-full max-w-md shadow-lg">
				<h2 className="text-2xl font-bold mb-4">Set a new password</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">New password</label>
						<div className="flex">
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((s) => !s)}
								className="ml-2 px-2 py-2 text-sm text-indigo-200"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Confirm password</label>
						<div className="flex">
							<input
								type={showConfirm ? 'text' : 'password'}
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								required
								className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
							/>
							<button
								type="button"
								onClick={() => setShowConfirm((s) => !s)}
								className="ml-2 px-2 py-2 text-sm text-indigo-200"
								aria-label={showConfirm ? 'Hide password' : 'Show password'}
							>
								{showConfirm ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>
					{error && <div className="text-red-400 text-sm">{error}</div>}
					{message && <div className="text-green-300 text-sm">{message}</div>}
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={loading}
							className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded font-semibold"
						>
							{loading ? 'Updating…' : 'Reset password'}
						</button>
						<button type="button" onClick={() => navigate('/login')} className="text-sm text-indigo-200 underline">
							Back to login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
