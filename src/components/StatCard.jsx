const StatCard = ({ title, value, label, accent }) => {
  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={`rounded-3xl px-4 py-3 text-sm font-semibold text-white ${accent}`}>{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
