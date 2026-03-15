import { useCallback, useState, useEffect } from 'react'
import type { ColorSlot, HarmonyMode, SavedPalette } from '../types/palette'
import { randomColor, harmonyColors } from '../utils/color'

const STORAGE_KEY = 'color-palette-saved'
const MIN_SLOTS = 4
const MAX_SLOTS = 8
const DEFAULT_SLOT_COUNT = 5

function createSlots(count: number): ColorSlot[] {
  return Array.from({ length: count }, () => ({
    hex: randomColor(),
    locked: false,
  }))
}

function loadSavedPalettes(): SavedPalette[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedPalette[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function savePalettesToStorage(palettes: SavedPalette[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
  } catch {
    // ignore
  }
}

export function usePalette() {
  const [slotCount, setSlotCount] = useState(DEFAULT_SLOT_COUNT)
  const [slots, setSlots] = useState<ColorSlot[]>(() => createSlots(DEFAULT_SLOT_COUNT))
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('random')
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(loadSavedPalettes)

  useEffect(() => {
    savePalettesToStorage(savedPalettes)
  }, [savedPalettes])

  const generate = useCallback(() => {
    setSlots((prev) => {
      if (harmonyMode === 'random') {
        return prev.map((slot) =>
          slot.locked ? slot : { ...slot, hex: randomColor() }
        )
      }
      const baseHue = Math.floor(Math.random() * 360)
      const newHexes = harmonyColors(baseHue, harmonyMode, slotCount)
      return prev.map((slot, i) =>
        slot.locked ? slot : { ...slot, hex: newHexes[i] ?? slot.hex }
      )
    })
  }, [harmonyMode, slotCount])

  const toggleLock = useCallback((index: number) => {
    setSlots((prev) => {
      const next = [...prev]
      const slot = next[index]
      if (slot) slot.locked = !slot.locked
      return next
    })
  }, [])

  const updateColor = useCallback((index: number, hex: string) => {
    setSlots((prev) => {
      const next = [...prev]
      if (next[index]) next[index] = { ...next[index]!, hex }
      return next
    })
  }, [])

  const setSlotsFromHexList = useCallback((hexList: string[]) => {
    setSlots(
      hexList.map((hex) => ({ hex, locked: false }))
    )
    setSlotCount(hexList.length)
  }, [])

  const reset = useCallback(() => {
    setSlots(createSlots(slotCount))
  }, [slotCount])

  const changeSlotCount = useCallback((count: number) => {
    const n = Math.max(MIN_SLOTS, Math.min(MAX_SLOTS, count))
    setSlotCount(n)
    setSlots((prev) => {
      if (n === prev.length) return prev
      if (n > prev.length) {
        const added = Array.from({ length: n - prev.length }, () => ({
          hex: randomColor(),
          locked: false,
        }))
        return [...prev, ...added]
      }
      return prev.slice(0, n)
    })
  }, [])

  const saveCurrentPalette = useCallback((name: string) => {
    const colors = slots.map((s) => s.hex)
    const entry: SavedPalette = {
      id: crypto.randomUUID(),
      name: name.trim() || `Palette ${Date.now()}`,
      colors,
      createdAt: Date.now(),
    }
    setSavedPalettes((prev) => [entry, ...prev])
  }, [slots])

  const loadPalette = useCallback((palette: SavedPalette) => {
    setSlotsFromHexList(palette.colors)
  }, [setSlotsFromHexList])

  const removeSavedPalette = useCallback((id: string) => {
    setSavedPalettes((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return {
    slots,
    slotCount,
    setSlotCount: changeSlotCount,
    harmonyMode,
    setHarmonyMode,
    generate,
    toggleLock,
    updateColor,
    reset,
    savedPalettes,
    saveCurrentPalette,
    loadPalette,
    removeSavedPalette,
    minSlots: MIN_SLOTS,
    maxSlots: MAX_SLOTS,
  }
}
