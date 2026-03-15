import { useCallback, useState, useEffect } from 'react'
import type { ColorSlot } from '../types/palette'
import { formatRgb, getContrastRatio, hexToHsl, hslToHex } from '../utils/color'
import styles from './ColorSwatch.module.css'

interface ColorSwatchProps {
  slot: ColorSlot
  index: number
  onToggleLock: (index: number) => void
  onUpdateColor: (index: number, hex: string) => void
}

export function ColorSwatch({ slot, index, onToggleLock, onUpdateColor }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const copyHex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(slot.hex)
      setCopied(true)
      const t = setTimeout(() => setCopied(false), 1500)
      return () => clearTimeout(t)
    } catch {
      setCopied(false)
    }
  }, [slot.hex])

  const ratioWhite = getContrastRatio(slot.hex, '#ffffff')
  const ratioBlack = getContrastRatio(slot.hex, '#000000')
  const passAA = ratioWhite >= 4.5 || ratioBlack >= 4.5
  const passAAA = ratioWhite >= 7 || ratioBlack >= 7

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.swatch}
        style={{ backgroundColor: slot.hex }}
        role="button"
        tabIndex={0}
        onClick={copyHex}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && copyHex()}
        aria-label={`Color ${slot.hex}, click to copy`}
      >
        <div className={styles.overlay}>
          <div className={styles.topRow}>
            <button
              type="button"
              className={styles.lock}
              onClick={(e) => {
                e.stopPropagation()
                onToggleLock(index)
              }}
              aria-label={slot.locked ? 'Unlock color' : 'Lock color'}
              title={slot.locked ? 'Unlock' : 'Lock'}
            >
              {slot.locked ? '🔒' : '🔓'}
            </button>
            {(passAA || passAAA) && (
              <span className={styles.contrast} title="WCAG contrast on white/black">
                {passAAA ? 'AAA' : 'AA'}
              </span>
            )}
          </div>
          <span className={styles.hex}>{slot.hex}</span>
          <span className={styles.rgb}>{formatRgb(slot.hex)}</span>
          <span className={styles.copyHint}>{copied ? 'Copied!' : 'Click to copy'}</span>
          <button
            type="button"
            className={styles.editBtn}
            onClick={(e) => {
              e.stopPropagation()
              setShowEditor((v) => !v)
            }}
            aria-expanded={showEditor}
            aria-label="Edit color with sliders"
          >
            {showEditor ? '▼ Close' : '◆ Edit'}
          </button>
        </div>
      </div>
      {showEditor && (
        <ColorEditor
          hex={slot.hex}
          onHexChange={(hex) => onUpdateColor(index, hex)}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  )
}

interface ColorEditorProps {
  hex: string
  onHexChange: (hex: string) => void
  onClose: () => void
}

function ColorEditor({ hex, onHexChange, onClose }: ColorEditorProps) {
  const [h, setH] = useState(0)
  const [s, setS] = useState(0)
  const [l, setL] = useState(0)

  useEffect(() => {
    const next = hexToHsl(hex)
    setH(next.h)
    setS(next.s)
    setL(next.l)
  }, [hex])

  const update = useCallback(
    (newH: number, newS: number, newL: number) => {
      setH(newH)
      setS(newS)
      setL(newL)
      onHexChange(hslToHex(newH, newS, newL))
    },
    [onHexChange]
  )

  return (
    <div className={styles.editor} onClick={(e) => e.stopPropagation()}>
      <div className={styles.editorRow}>
        <label className={styles.editorLabel}>H</label>
        <input
          type="range"
          min={0}
          max={360}
          value={h}
          onChange={(e) => update(Number(e.target.value), s, l)}
          className={styles.slider}
        />
        <span className={styles.editorValue}>{h}</span>
      </div>
      <div className={styles.editorRow}>
        <label className={styles.editorLabel}>S</label>
        <input
          type="range"
          min={0}
          max={100}
          value={s}
          onChange={(e) => update(h, Number(e.target.value), l)}
          className={styles.slider}
        />
        <span className={styles.editorValue}>{s}</span>
      </div>
      <div className={styles.editorRow}>
        <label className={styles.editorLabel}>L</label>
        <input
          type="range"
          min={0}
          max={100}
          value={l}
          onChange={(e) => update(h, s, Number(e.target.value))}
          className={styles.slider}
        />
        <span className={styles.editorValue}>{l}</span>
      </div>
      <button type="button" className={styles.closeEditor} onClick={onClose}>
        Close
      </button>
    </div>
  )
}
