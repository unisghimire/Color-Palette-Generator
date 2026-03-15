import { useEffect } from 'react'
import { usePalette } from './hooks/usePalette'
import { ColorSwatch } from './components/ColorSwatch'
import { PaletteControls } from './components/PaletteControls'
import styles from './App.module.css'

function App() {
  const {
    slots,
    slotCount,
    setSlotCount,
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
    minSlots,
    maxSlots,
  } = usePalette()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !(e.target as HTMLElement).closest('button, input, select, [contenteditable]')) {
        e.preventDefault()
        generate()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [generate])

  const hexList = slots.map((s) => s.hex)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Color Palette Generator</h1>
        <p className={styles.subtitle}>
          Lock colors, pick a harmony, and generate palettes. Click a swatch to copy; use Edit for HSL sliders. Export as CSS, JSON, or save for later.
        </p>
      </header>

      <main className={styles.main}>
        <PaletteControls
          harmonyMode={harmonyMode}
          onHarmonyChange={setHarmonyMode}
          slotCount={slotCount}
          onSlotCountChange={setSlotCount}
          minSlots={minSlots}
          maxSlots={maxSlots}
          hexList={hexList}
          onGenerate={generate}
          onReset={reset}
          onSavePalette={saveCurrentPalette}
          savedPalettes={savedPalettes}
          onLoadPalette={loadPalette}
          onRemoveSaved={removeSavedPalette}
        />
        <div className={styles.palette} role="list">
          {slots.map((slot, index) => (
            <div key={index} role="listitem" className={styles.slot}>
              <ColorSwatch
                slot={slot}
                index={index}
                onToggleLock={toggleLock}
                onUpdateColor={updateColor}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
