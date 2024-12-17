import { Presentation } from '../types/presentation'

const STORAGE_KEY = 'presentations'

export const storage = {
  savePresentation(presentation: Presentation): void {
    const presentations = this.getAllPresentations()
    const index = presentations.findIndex(p => p.id === presentation.id)
    
    if (index >= 0) {
      presentations[index] = presentation
    } else {
      presentations.push(presentation)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presentations))
  },

  getPresentation(id: string): Presentation | null {
    const presentations = this.getAllPresentations()
    return presentations.find(p => p.id === id) || null
  },

  getAllPresentations(): Presentation[] {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  deletePresentation(id: string): void {
    const presentations = this.getAllPresentations()
    const filtered = presentations.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }
}