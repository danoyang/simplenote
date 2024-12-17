import type { MotionVariants } from '@vueuse/motion'
import { transitions } from './transitions'
import { createMotionState } from './motionStates'

export const createVariants = (
  isActive: boolean,
  isPast: boolean,
  offset: number
): MotionVariants => {
  const state = createMotionState(isActive, isPast, offset)
  
  return {
    initial: {
      opacity: 0,
      y: 20,
      transition: transitions.fade,
    },
    enter: {
      opacity: state.opacity,
      y: state.y,
      transition: transitions.slide,
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: transitions.fade,
    },
  }
}