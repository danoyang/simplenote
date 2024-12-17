export interface PresentationElement {
  id: string
  type: 'text' | 'image'
  content: string
  sequence: number
  fontSize?: number // Added for text size control
}

export interface Presentation {
  id: string
  name: string
  elements: PresentationElement[]
  lastModified: number
}