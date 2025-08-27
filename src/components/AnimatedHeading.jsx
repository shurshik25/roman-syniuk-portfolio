import { motion } from 'framer-motion'

const AnimatedHeading = ({
  children,
  level = 1,
  className = '',
  delay = 0,
  variant = 'default',
}) => {
  const variants = {
    default: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay, ease: 'easeOut' },
    },
    slideIn: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay, ease: 'easeOut' },
    },
    fadeUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, delay, ease: 'easeOut' },
    },
  }

  const selectedVariant = variants[variant] || variants.default

  const Tag = `h${level}`

  return (
    <motion.div
      initial={selectedVariant.initial}
      whileInView={selectedVariant.animate}
      transition={selectedVariant.transition}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      <Tag className="text-4xl lg:text-5xl font-bold text-white mb-6">{children}</Tag>
    </motion.div>
  )
}

export default AnimatedHeading
