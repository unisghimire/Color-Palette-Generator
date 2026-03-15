import { useState, useCallback, useRef, useEffect } from 'react'
import type { HarmonyMode, SavedPalette } from '../types/palette'
import {
  formatAsCssVariables,
  formatAsJson,
  formatAsHexList,
  formatAsScssVariables,
} from '../utils/exportFormats'
import styles from './PaletteControls.module.css'

const HARMONY_OPTIONS: { value: HarmonyMode; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'monochromatic', label: 'Monochromatic' },
]

interface PaletteControlsProps {
  harmonyMode: HarmonyMode
  onHarmonyChange: (mode: HarmonyMode) => void
  slotCount: number
  onSlotCountChange: (n: number) => void
  minSlots: number
  maxSlots: number
  hexList: string[]
  onGenerate: () => void
  onReset: () => void
  onSavePalette: (name: string) => void
  savedPalettes: SavedPalette[]
  onLoadPalette: (p: SavedPalette) => void
  onRemoveSaved: (id: string) => void
}

export function PaletteControls({
  harmonyMode,
  onHarmonyChange,
  slotCount,
  onSlotCountChange,
  minSlots,
  maxSlots,
  hexList,
  onGenerate,
  onReset,
  onSavePalette,
  savedPalettes,
  onLoadPalette,
  onRemoveSaved,
}: PaletteControlsProps) {
  const [exportOpen, setExportOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const savedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (exportRef.current && !exportRef.current.contains(target)) setExportOpen(false)
      if (savedRef.current && !savedRef.current.contains(target)) setSavedOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(label)
      setTimeout(() => setCopyFeedback(null), 2000)
      setExportOpen(false)
    } catch {
      setCopyFeedback('Failed to copy')
    }
  }, [])

  const handleExport = useCallback(
    (format: 'css' | 'json' | 'hex' | 'scss') => {
      const label = format.toUpperCase()
      switch (format) {
        case 'css':
          copyToClipboard(`:root {\n${formatAsCssVariables(hexList)}\n}`, `Copied ${label}`)
          break
        case 'json':
          copyToClipboard(formatAsJson(hexList), `Copied ${label}`)
          break
        case 'hex':
          copyToClipboard(formatAsHexList(hexList), `Copied ${label}`)
          break
        case 'scss':
          copyToClipboard(formatAsScssVariables(hexList), `Copied ${label}`)
          break
      }
    },
    [hexList, copyToClipboard]
  )

  const handleSave = useCallback(() => {
    const name = window.prompt('Name this palette', `Palette ${new Date().toLocaleDateString()}`)
    if (name !== null) onSavePalette(name)
    setSavedOpen(false)
  }, [onSavePalette])

  return (
    <div className={styles.controls}>
      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="harmony-select" className={styles.label}>
            Harmony
          </label>
          <select
            id="harmony-select"
            className={styles.select}
            value={harmonyMode}
            onChange={(e) => onHarmonyChange(e.target.value as HarmonyMode)}
            aria-label="Color harmony mode"
          >
            {HARMONY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.group}>
          <label htmlFor="slot-count" className={styles.label}>
            Colors
          </label>
          <select
            id="slot-count"
            className={styles.select}
            value={slotCount}
            onChange={(e) => onSlotCountChange(Number(e.target.value))}
            aria-label="Number of colors"
          >
            {Array.from({ length: maxSlots - minSlots + 1 }, (_, i) => minSlots + i).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={onGenerate} aria-label="Generate new palette">
          Generate
        </button>
        <button type="button" className={styles.secondary} onClick={onReset} aria-label="Reset palette">
          Reset
        </button>

        <div className={styles.dropdown} ref={exportRef}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => setExportOpen((v) => !v)}
            aria-expanded={exportOpen}
            aria-haspopup="true"
          >
            Export ▾
          </button>
          {exportOpen && (
            <div className={styles.menu}>
              <button type="button" onClick={() => handleExport('css')}>
                CSS variables
              </button>
              <button type="button" onClick={() => handleExport('scss')}>
                SCSS variables
              </button>
              <button type="button" onClick={() => handleExport('json')}>
                JSON
              </button>
              <button type="button" onClick={() => handleExport('hex')}>
                Hex list
              </button>
            </div>
          )}
        </div>

        <button type="button" className={styles.secondary} onClick={handleSave} aria-label="Save palette">
          Save
        </button>

        {savedPalettes.length > 0 && (
          <div className={styles.dropdown} ref={savedRef}>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => setSavedOpen((v) => !v)}
              aria-expanded={savedOpen}
              aria-haspopup="true"
            >
              Saved ({savedPalettes.length}) ▾
            </button>
            {savedOpen && (
              <div className={styles.menu + ' ' + styles.savedMenu}>
                {savedPalettes.map((p) => (
                  <div key={p.id} className={styles.savedItem}>
                    <button
                      type="button"
                      className={styles.savedLoad}
                      onClick={() => {
                        onLoadPalette(p)
                        setSavedOpen(false)
                      }}
                    >
                      <span className={styles.savedSwatches}>
                        {p.colors.slice(0, 5).map((c) => (
                          <span
                            key={c}
                            className={styles.miniSwatch}
                            style={{ backgroundColor: c }}
                            aria-hidden
                          />
                        ))}
                      </span>
                      {p.name}
                    </button>
                    <button
                      type="button"
                      className={styles.savedRemove}
                      onClick={() => onRemoveSaved(p.id)}
                      aria-label={`Remove ${p.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {copyFeedback && <span className={styles.feedback}>{copyFeedback}</span>}
    </div>
  )
}
