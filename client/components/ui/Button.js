const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  outline: "border border-slate-300 hover:bg-slate-50 text-slate-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "hover:bg-slate-100 text-slate-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
