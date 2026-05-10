import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tasks', to: '/tasks' }
];

const Topbar = ({ user, onLogout }) => {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-600">Active workspace</p>
            <h1 className="text-2xl font-semibold text-slate-950">Welcome back, {user?.name || 'team lead'}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{user?.email}</div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={onLogout}
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'inline-flex rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white'
                  : 'inline-flex rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
