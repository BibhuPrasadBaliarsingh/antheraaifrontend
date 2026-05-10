import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-center sm:px-6 lg:px-8">
      <div className="w-full max-w-xl rounded-[28px] bg-white px-10 py-16 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Page not found</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">404</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">The page you are looking for doesn’t exist or has been moved.</p>
        <Link to="/dashboard" className="button-primary mt-8 inline-flex">
          Go back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
