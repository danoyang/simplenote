export interface MotionState {
  opacity: number
  y: number
}

export const createMotionState = (
  isActive: boolean,
  isPast: boolean,
  offset: number
): MotionState => ({
  opacity: isActive ? 1 : isPast ? 0.3 : 0,
  y: isPast ? -30 * offset : isActive ? 0 : 20,
})