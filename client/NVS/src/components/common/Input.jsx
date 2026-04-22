function Input({ label, error, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      {label ? <span className="text-sm font-semibold text-nvs-brown">{label}</span> : null}
      <input
        className="rounded-[24px] border border-nvs-line bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-nvs-purple focus:ring-2 focus:ring-nvs-purple/10"
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
    </label>
  )
}

export default Input
