import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { register, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Unable to register');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[28px] bg-white px-8 py-10 shadow-soft">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Create account</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Register your team</h1>
          <p className="mt-3 text-sm text-slate-500">Professional workspace for project planning.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Full name
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Work email
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
