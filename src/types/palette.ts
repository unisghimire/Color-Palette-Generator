export interface ColorSlot {
  hex: string
  locked: boolean
}

export type HarmonyMode = 'random' | 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic'

export interface SavedPalette {
  id: string
  name: string
  colors: string[]
  createdAt: number
}
