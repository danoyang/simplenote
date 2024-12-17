import type { MotionVariants } from '@vueuse/motion'

export interface AnimationState {
  isActive: boolean
  isPast: boolean
  offset: number
}

// Define transition presets
export const transitions = {
  smooth: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  fade: {
    type: 'tween',
    duration: 300,
    ease: 'easeInOut',
  },
} as const

// Calculate element states
export const calculateElementState = (state: AnimationState) => ({
  opacity: state.isActive ? 1 : state.isPast ? 0.3 : 0,
  y: state.isPast ? -30 * state.offset : state.isActive ? 0 : 20,
})

// Create motion variants with explicit typing
export const createElementVariants = (state: AnimationState): MotionVariants => {
  const elementState = calculateElementState(state)
  
  return {
    initial: {
      opacity: 0,
      y: 20,
      transition: transitions.fade,
    },
    enter: {
      opacity: elementState.opacity,
      y: elementState.y,
      transition: transitions.smooth,
    },
    leave: {
      opacity: 0,
      y: -20,
      transition: transitions.fade,
    },
  }
}