// Botãos. variante: primary | secondary | success | danger | warning | info
const CORES = {
  primary: "bg-primary focus:ring-primary",
  secondary: "bg-secondary focus:ring-secondary",
  success: "bg-success focus:ring-success",
  danger: "bg-danger focus:ring-danger",
  warning: "bg-warning focus:ring-warning",
  info: "bg-info focus:ring-info",
};

export function Botao({
  children,
  variante = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 " +
    "font-medium text-white transition hover:brightness-110 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button className={`${base} ${CORES[variante]} ${className}`} {...props}>
      {children}
    </button>
  );
}
