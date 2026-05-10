const EmptyState = ({ title, message }) => {
  return (
    <div className="card-surface border-dashed border-slate-300 p-10 text-center text-slate-500">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <p className="mt-3 text-base leading-7">{message}</p>
    </div>
  );
};

export default EmptyState;
