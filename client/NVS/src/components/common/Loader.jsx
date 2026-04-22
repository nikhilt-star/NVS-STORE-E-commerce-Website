import { motion } from 'framer-motion'

function Loader({ label = 'Loading NVS essentials...' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
        className="h-12 w-12 rounded-full border-4 border-nvs-beige border-t-nvs-purple"
      />
      <p className="text-sm font-medium text-nvs-brown/70">{label}</p>
    </div>
  )
}

export default Loader
