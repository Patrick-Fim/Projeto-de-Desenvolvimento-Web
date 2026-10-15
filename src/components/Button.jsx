export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ariaLabel,
  ...props
}) {
  // Variantes de cor com suporte dinamico a Dark Mode
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white dark:text-slate-950 shadow-md focus:ring-primary',
    ecological: 'bg-accent hover:opacity-90 text-white shadow-md focus:ring-accent',
    dark: 'bg-foreground hover:opacity-90 text-background shadow-md focus:ring-foreground',
    outline: 'border-2 border-primary-text text-primary-text hover:bg-primary/10 focus:ring-primary',
    ghost: 'text-foreground hover:bg-primary/10 focus:ring-primary',
  };

  // Tamanhos
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`font-semibold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}