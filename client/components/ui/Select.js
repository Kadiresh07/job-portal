export default function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select
        className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
