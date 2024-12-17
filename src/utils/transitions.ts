// Define reusable transition configurations
export const transitions = {
  fade: {
    type: 'tween',
    duration: 300,
    ease: 'easeInOut',
  },
  slide: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
} as const