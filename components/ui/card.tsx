export function Card({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="p-6 bg-white border border-slate-100 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}