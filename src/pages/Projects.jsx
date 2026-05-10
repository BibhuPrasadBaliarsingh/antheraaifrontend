import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createProject, fetchProjects, inviteProjectMember } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const getProjectId = (project) => project?._id ?? project?.id;

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetchProjects()
      .then((data) => {
        setProjects(data.projects || []);
        setSelectedProject((prev) => prev || (data.projects?.[0] ?? null));
      })
      .catch((err) => toast.error(err.message || 'Unable to load projects'))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    if (!projectName || !projectDescription) {
      toast.error('Project name and description are required');
      return;
    }

    setSaving(true);
    try {
      const data = await createProject({ title: projectName, description: projectDescription });
      setProjects((prev) => [data.project, ...prev]);
      setProjectName('');
      setProjectDescription('');
      setSelectedProject(data.project);
      toast.success('Project created');
    } catch (err) {
      toast.error(err.message || 'Unable to create project');
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    if (!selectedProject) {
      toast.error('Select a project first');
      return;
    }
    if (!memberEmail) {
      toast.error('Enter a team member email');
      return;
    }
    setSaving(true);
    try {
      await inviteProjectMember(getProjectId(selectedProject), { email: memberEmail });
      setMemberEmail('');
      toast.success('Invitation sent');
    } catch (err) {
      toast.error(err.message || 'Could not invite member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Project workspace</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">Projects</h2>
            </div>
          </div>
          <form className="grid gap-4" onSubmit={handleCreateProject}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Project name
                <input
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="Onboarding sprint"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Short description
                <input
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="Track tasks, goals, and deadlines"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </label>
            </div>
            <button className="button-primary w-full" type="submit" disabled={saving}>
              {saving ? 'Creating project…' : 'Create project'}
            </button>
          </form>
        </div>
        <div className="card-surface p-6">
          <h3 className="text-lg font-semibold text-slate-950">Invite team members</h3>
          <p className="mt-2 text-sm text-slate-600">Add people to collaborate on the selected project.</p>
          <form className="mt-6 grid gap-4" onSubmit={handleInvite}>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="member@company.com"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
            <button className="button-secondary w-full" type="submit" disabled={saving}>
              {saving ? 'Sending invite…' : 'Invite member'}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="card-surface p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your projects</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">All active work</h2>
            </div>
          </div>
          {loading ? (
            <LoadingSpinner message="Loading projects…" />
          ) : projects.length === 0 ? (
            <EmptyState title="No projects yet" message="Create your first project to begin assigning tasks and inviting teammates." />
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <button
                  key={getProjectId(project)}
                  type="button"
                  className={`w-full rounded-3xl border px-5 py-5 text-left transition ${
                    getProjectId(selectedProject) === getProjectId(project)
                      ? 'border-sky-600 bg-sky-50 text-slate-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{project.name}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{project.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {project.owner_name ? `Owner: ${project.owner_name}` : 'Project'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card-surface p-6">
          <h3 className="text-lg font-semibold text-slate-950">Project details</h3>
          {selectedProject ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">{selectedProject.name}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Description</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{selectedProject.description}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Owner</p>
                <p className="mt-3 text-sm text-slate-700">{selectedProject.owner_name ?? 'You'}</p>
              </div>
            </div>
          ) : (
            <EmptyState title="No project selected" message="Choose a project on the left to see details and invite members." />
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
