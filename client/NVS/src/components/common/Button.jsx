import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-nvs-purple text-white shadow-[0_12px_30px_rgba(91,68,144,0.18)] hover:bg-[#513b84]',
  secondary: 'bg-white text-nvs-brown ring-1 ring-nvs-line hover:bg-nvs-cream',
  accent: 'bg-nvs-rose text-white hover:bg-[#e8473d]',
  ghost: 'bg-transparent text-nvs-brown hover:bg-nvs-cream',
}

function Button({
  as: Component = motion.button,
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) {
  return (
    <Component
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`inline-flex items-center justify-center rounded-pill px-6 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Button
