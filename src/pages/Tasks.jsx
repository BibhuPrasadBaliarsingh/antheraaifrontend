import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createTask, fetchProjectTasks, fetchProjects, updateTask } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const statusOptions = ['Todo', 'In Progress', 'Review', 'Done'];
const priorityOptions = ['Low', 'Medium', 'High'];
const getProjectId = (project) => project?._id ?? project?.id;
const getTaskId = (task) => task?._id ?? task?.id;

const Tasks = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Medium', status: 'Todo', due_date: '' });

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProjects()
      .then((data) => {
        setProjects(data.projects || []);
        setSelectedProject(data.projects?.[0] ?? null);
      })
      .catch((err) => toast.error(err.message || 'Unable to load projects'));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedProject) {
      setTasks([]);
      return;
    }

    setLoading(true);
    fetchProjectTasks(getProjectId(selectedProject))
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => toast.error(err.message || 'Unable to load tasks'))
      .finally(() => setLoading(false));
  }, [selectedProject]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }
    if (!taskForm.title || !taskForm.description) {
      toast.error('Task title and description are required');
      return;
    }

    setSaving(true);
    try {
      const data = await createTask(getProjectId(selectedProject), taskForm);
      setTasks((prev) => [data.task, ...prev]);
      setTaskForm({ title: '', description: '', priority: 'Medium', status: 'Todo', due_date: '' });
      toast.success('Task added');
    } catch (err) {
      toast.error(err.message || 'Unable to add task');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    setSaving(true);
    try {
      const data = await updateTask(taskId, updates);
      setTasks((prev) => prev.map((task) => (getTaskId(task) === taskId ? data.task : task)));
    } catch (err) {
      toast.error(err.message || 'Unable to update task');
    } finally {
      setSaving(false);
    }
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter, tasks]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card-surface p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Task board</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">Manage tasks</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Select project
              <select
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                value={getProjectId(selectedProject) || ''}
                onChange={(e) => setSelectedProject(projects.find((project) => String(getProjectId(project)) === e.target.value))}
              >
                <option value="">Choose project</option>
                {projects.map((project) => (
                  <option key={getProjectId(project)} value={getProjectId(project)}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Filter status
              <select
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="card-surface p-6">
          <h3 className="text-lg font-semibold text-slate-950">New task</h3>
          <form className="mt-6 grid gap-4" onSubmit={handleCreateTask}>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <textarea
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              rows={4}
              placeholder="Task description"
              value={taskForm.description}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <select
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                value={taskForm.status}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                value={taskForm.priority}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))}
              >
                {priorityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
            <button className="button-primary w-full" type="submit" disabled={saving}>
              {saving ? 'Adding task…' : 'Add task'}
            </button>
          </form>
        </div>
      </section>

      <section className="card-surface p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Task list</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{selectedProject ? selectedProject.name : 'Select a project'}</h2>
          </div>
          <div className="text-sm text-slate-500">Showing {filteredTasks.length} tasks</div>
        </div>
        {loading ? (
          <LoadingSpinner message="Loading tasks…" />
        ) : selectedProject ? (
          filteredTasks.length === 0 ? (
            <EmptyState title="No tasks yet" message="Use the form to create tasks for this project." />
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={getTaskId(task)} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{task.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm">{task.priority}</span>
                      <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">{task.status}</span>
                      <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{task.due_date || 'No due date'}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <select
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      value={task.status}
                      onChange={(e) => handleUpdateTask(getTaskId(task), { ...task, status: e.target.value })}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <select
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      value={task.priority}
                      onChange={(e) => handleUpdateTask(getTaskId(task), { ...task, priority: e.target.value })}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <EmptyState title="No project selected" message="Pick a project to view tasks and progress." />
        )}
      </section>
    </div>
  );
};

export default Tasks;
