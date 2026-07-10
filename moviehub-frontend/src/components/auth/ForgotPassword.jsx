import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJSON } from '../../utils/fetchHelpers';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setMessage('');
		setLoading(true);
		try {
			const res = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			const data = await parseJSON(res);
			if (!res.ok) throw new Error((data && (data.message || data._raw)) || 'Request failed');
			setMessage(data.message || 'If an account exists, a reset email was sent.');
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
			<div className="bg-slate-900/60 backdrop-blur rounded-lg p-8 w-full max-w-md shadow-lg">
				<h2 className="text-2xl font-bold mb-4">Reset your password</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Email address</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
						/>
					</div>
					{error && <div className="text-red-400 text-sm">{error}</div>}
					{message && <div className="text-green-300 text-sm">{message}</div>}
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={loading}
							className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded font-semibold"
						>
							{loading ? 'Sending…' : 'Send reset email'}
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
