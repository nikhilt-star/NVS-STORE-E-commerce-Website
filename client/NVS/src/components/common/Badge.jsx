function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill bg-white/95 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-nvs-purple shadow-sm ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
