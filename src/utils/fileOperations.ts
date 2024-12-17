import type { Presentation } from '../types/presentation'

export const fileOperations = {
  exportPresentation(presentation: Presentation) {
    const data = JSON.stringify(presentation, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${presentation.name.replace(/\s+/g, '_')}.json`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  async importPresentation(file: File): Promise<Presentation> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const presentation = JSON.parse(content)
          
          // Validate the imported data structure
          if (!presentation.id || !presentation.name || !Array.isArray(presentation.elements)) {
            throw new Error('Invalid presentation format')
          }
          
          resolve(presentation)
        } catch (error) {
          reject(new Error('Failed to parse presentation file'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
}