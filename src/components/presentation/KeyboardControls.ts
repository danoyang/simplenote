import { watch } from 'vue'
import type { Ref } from 'vue'

export function useKeyboardControls(
  isPlaying: Ref<boolean>,
  currentIndex: Ref<number>,
  maxIndex: number
) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (!isPlaying.value) return
    
    if (event.code === 'Space' || event.code === 'ArrowRight') {
      if (currentIndex.value < maxIndex) {
        currentIndex.value++
      }
      event.preventDefault()
    } else if (event.code === 'ArrowLeft') {
      if (currentIndex.value > 0) {
        currentIndex.value--
      }
      event.preventDefault()
    }
  }

  watch(isPlaying, (newValue) => {
    if (newValue) {
      window.addEventListener('keydown', handleKeyPress)
    } else {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, { immediate: true })

  // Cleanup on component unmount
  return () => {
    window.removeEventListener('keydown', handleKeyPress)
  }
}