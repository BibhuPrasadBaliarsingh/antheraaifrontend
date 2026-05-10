import { NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tasks', to: '/tasks' }
];

const Sidebar = () => {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-slate-200/70 bg-slate-950 text-slate-50 lg:block">
      <div className="flex h-full flex-col justify-between px-8 py-10">
        <div>
          <div className="mb-10 flex items-center gap-3 rounded-3xl bg-slate-900/80 px-4 py-4 shadow-soft">
            <div className="rounded-2xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white">TT</div>
            <div>
              <p className="text-sm text-slate-400">Team Task Manager</p>
              <p className="font-semibold">Work faster, ship smarter</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? 'block rounded-3xl bg-sky-600 px-5 py-4 text-sm font-semibold text-white transition'
                    : 'block rounded-3xl px-5 py-4 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-5 text-sm leading-6 text-slate-300 shadow-soft">
          <p className="font-semibold text-slate-100">Modern project workflow</p>
          <p className="mt-3 text-sm text-slate-400">Use the Tasks page to assign work and keep every sprint on track.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
