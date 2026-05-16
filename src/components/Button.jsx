export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
}) {
  const base =
    'group relative inline-flex items-center justify-center overflow-hidden text-xs font-black tracking-widest uppercase'

  const variants = {
    primary: {
      outer: 'bg-text text-primary',
      sweep: 'bg-accent',
      textHover: 'group-hover:text-text',
    },
    outline: {
      outer: 'border border-text/30 text-text',
      sweep: 'bg-text',
      textHover: 'group-hover:text-primary',
    },
  }

  const sizes = {
    sm: 'px-6 py-4',
    md: 'px-10 py-5',
    lg: 'px-12 py-6',
  }

  const v = variants[variant]
  const cls = `${base} ${v.outer} ${sizes[size]} ${className}`

  const inner = (
    <>
      {/* Sweep background — slides in from the left on hover */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out ${v.sweep}`}
      />
      {/* Label */}
      <span className={`relative z-10 transition-colors duration-300 delay-100 ${v.textHover}`}>
        {children}
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls}>
        {inner}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
