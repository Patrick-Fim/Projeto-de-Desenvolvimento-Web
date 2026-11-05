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
  // Classes visuais centralizadas para manter consistentes as variantes do botão.
  const variants = {
    primary: 'bg-primary-dark text-white dark:text-slate-950 shadow-sm shadow-primary/20 hover:brightness-110 focus-visible:ring-primary',
    ecological: 'bg-accent-text text-white dark:text-slate-950 shadow-sm hover:brightness-110 focus-visible:ring-accent',
    dark: 'bg-foreground text-background shadow-sm hover:opacity-90 focus-visible:ring-foreground',
    outline: 'border-2 border-primary-text/50 text-primary-text hover:border-primary-text hover:bg-primary/5 focus-visible:ring-primary',
    ghost: 'text-foreground hover:bg-foreground/5 focus-visible:ring-primary',
    danger: 'bg-ring-fire text-white dark:text-slate-950 shadow-sm hover:brightness-110 focus-visible:ring-ring-fire',
  };

  // Espaçamento e tipografia disponíveis para cada tamanho.
  const sizes = {
    sm: 'px-3.5 py-2 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
