const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-soft">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
