import { useEffect, useMemo, useState } from 'react';
import { fetchDashboard } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [dashboard, setDashboard] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    recentTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetchDashboard()
      .then((data) => setDashboard({
        totalTasks: data.totalTasks ?? 0,
        completedTasks: data.completedTasks ?? 0,
        pendingTasks: data.pendingTasks ?? 0,
        overdueTasks: data.overdueTasks ?? 0,
        recentTasks: data.recentTasks ?? []
      }))
      .catch((err) => {
        toast.error(err.message || 'Could not load dashboard');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const taskRows = useMemo(() => dashboard.recentTasks || [], [dashboard.recentTasks]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-4">
        <StatCard title="Total tasks" value={dashboard.totalTasks} label="Overview" accent="bg-sky-600" />
        <StatCard title="Completed" value={dashboard.completedTasks} label="Done" accent="bg-emerald-600" />
        <StatCard title="Pending" value={dashboard.pendingTasks} label="In progress" accent="bg-amber-500" />
        <StatCard title="Overdue" value={dashboard.overdueTasks} label="Action" accent="bg-rose-600" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
        <div className="card-surface p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recent tasks</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">Latest activity</h2>
            </div>
          </div>
          {loading ? (
            <LoadingSpinner message="Refreshing task feed…" />
          ) : taskRows.length === 0 ? (
            <EmptyState title="No tasks found" message="Create a project and add your first task to populate the dashboard." />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-slate-500">Task</th>
                    <th className="px-6 py-4 font-medium text-slate-500">Project</th>
                    <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                    <th className="px-6 py-4 font-medium text-slate-500">Due date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {taskRows.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900">{item.title}</td>
                      <td className="px-6 py-4 text-slate-500">{item.projectName || item.project_name || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.due_date || 'None'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-surface p-6">
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Insights</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">Team priorities</h2>
          </div>
          <p className="text-slate-600">Track completion, overdue tasks, and keep the most important work visible. Projects and tasks drive delivery across your team.</p>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Focus area</p>
              <p className="mt-2 text-sm text-slate-600">Move overdue tasks into the next sprint and keep daily standups aligned.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Delivery rhythm</p>
              <p className="mt-2 text-sm text-slate-600">Use Tasks to update statuses and keep project delivery predictable.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
