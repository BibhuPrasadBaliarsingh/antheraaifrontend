import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Unable to sign in');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[28px] bg-white px-8 py-10 shadow-soft">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Team task manager</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Sign in to your account</h1>
          <p className="mt-3 text-sm text-slate-500">Secure access for your team workspace.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Email address
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Password
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              minLength={8}
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="button-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
