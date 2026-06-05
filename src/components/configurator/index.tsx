'use client'


import { useState, useTransition } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useConfigurator } from '@/store/configurator'
import { useCart } from '@/store/cart'
import { FormatSelector } from './format-selector'
import { ColorSelector } from './color-selector'
import { FrameSelector } from './frame-selector'
import { LocationInput } from './location-input'
import { DateTimePicker } from './date-time-picker'
import { MessageInputs } from './message-inputs'
import { PriceSummary } from './price-summary'
import { PosterPreview } from './poster-preview'


const STEPS = [
  { n: '01', label: 'Formaat' },
  { n: '02', label: 'Personalisatie' },
  { n: '03', label: "Extra's" },
] as const


type Step = 0 | 1 | 2


export function Configurator() {
  const router = useRouter()
  const store  = useConfigurator()
  const cart   = useCart()
  const [step, setStep]       = useState<Step>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()


  const canAdvance0 = store.format === 'digital'
    ? true
    : !!store.printColor && (!store.hasFrame || !!store.frameColor)


  const canAdvance1 = !!store.location && !!store.date


const handleAddToCart = () => {
  if (!store.isComplete) return

  setLoading(true)
  setError(null)

  try {
    // Remove the item being edited before re-adding with new values
    if (store.editingId) {
      cart.remove(store.editingId)
    }

    cart.add({
      format:       store.format,
      printColor:   store.printColor,
      hasFrame:     store.hasFrame,
      frameColor:   store.frameColor,
      hasGiftCard:  store.hasGiftCard,
      location:     store.location,
      posterLabel:  store.posterLabel,
      date:         store.date,
      time:         store.time,
      message:      store.message,
      giftCardText: store.giftCardText,
      totalPrice:   store.totalPrice,
    })

    store.reset()

    startTransition(() => {
      router.push('/winkelwagen')
    })
  } catch (err) {
    console.error('[Cart] Error adding to cart:', err)
    setError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer opnieuw.')
    setLoading(false)
  }
}

  const isBusy = loading || isPending


  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Mobile — static poster image */}
      <div className="block bg-[var(--surface)] px-8 py-10 lg:hidden">
        {(() => {
          const color = store.printColor ?? 'taupe'
          const key = store.hasFrame && store.frameColor
            ? `${color}-frame-${store.frameColor}`
            : color
          const ext = key === 'taupe' ? 'webp' : 'jpg'
          return (
            <img
              src={`/images/posters/${key}.${ext}`}
              alt="Poster preview"
              className="mx-auto h-72 w-auto object-contain"
            />
          )
        })()}
      </div>


      {/* Left — sticky poster preview (desktop) */}
      <div className="hidden lg:block lg:w-[45%]">
        <div className="sticky top-0 h-[calc(100vh-73px)]">
          <PosterPreview />
        </div>
      </div>


      {/* Right — form */}
      <div className="flex flex-1 flex-col px-8 py-12 lg:px-16 lg:py-16">
        <div className="mx-auto w-full max-w-lg">


          {/* Step indicator */}
          <div className="mb-12 flex items-center gap-6">
            {STEPS.map(({ n, label }, i) => {
              const active  = step === i
              const done    = step > i
              const locked  = (i === 1 && !canAdvance0) || (i === 2 && (!canAdvance0 || !canAdvance1))
              return (
                <button
                  key={n}
                  type="button"
                  disabled={locked || isBusy}
                  onClick={() => !locked && !isBusy && setStep(i as Step)}
                  className="flex items-center gap-2 disabled:cursor-not-allowed"
                >
                  <span
                    className={[
                      'text-[10px] font-medium tabular-nums transition-colors',
                      active ? 'text-[var(--foreground)]' : done ? 'text-[var(--muted)]' : 'text-[var(--border)]',
                    ].join(' ')}
                  >
                    {n}
                  </span>
                  <span
                    className={[
                      'text-[11px] uppercase tracking-[0.18em] transition-colors',
                      active ? 'text-[var(--foreground)]' : done ? 'text-[var(--muted)]' : 'text-[var(--border)]',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="ml-2 text-[var(--border)]">/</span>
                  )}
                </button>
              )
            })}
          </div>


          {/* Step content */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              {step === 0 && (
                <>
                  <FormatSelector />
                  <ColorSelector />
                  <FrameSelector />
                </>
              )}
              {step === 1 && (
                <>
                  <LocationInput />
                  <div>
                    <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                      Locatie op poster
                    </label>
                    <input
                      type="text"
                      value={store.posterLabel}
                      onChange={(e) => store.setPosterLabel(e.target.value)}
                      placeholder="Bijv. Utrecht, Amsterdam…"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--foreground)] focus:outline-none"
                    />
                  </div>
                  <DateTimePicker />
                </>
              )}
              {step === 2 && <MessageInputs />}
            </motion.div>
          </AnimatePresence>


          {/* Price + navigation */}
          <div className="mt-14 space-y-6">
            <PriceSummary />


            {error && (
              <p className="text-[13px] text-red-500">{error}</p>
            )}


            <div className="flex items-center justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  disabled={isBusy}
                  className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] transition-opacity hover:opacity-60 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Terug
                </button>
              ) : (
                <span />
              )}


              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  disabled={(step === 0 && !canAdvance0) || (step === 1 && !canAdvance1) || isBusy}
                  className="inline-block rounded-full bg-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-75 disabled:opacity-30"
                >
                  Volgende
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!store.isComplete || isBusy}
                  className="inline-block rounded-full bg-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-75 disabled:opacity-30"
                >
                  {isBusy ? 'Moment…' : store.editingId ? 'Wijzigingen opslaan' : 'Voeg toe aan winkelwagen'}
                </button>
              )}
            </div>

            <p className="text-center text-[10px] leading-relaxed text-[var(--muted)] opacity-60">
              De sterrenlucht op de getoonde poster is niet gegenereerd op basis van jouw gekozen locatie, datum en tijd.
            </p>
          </div>


        </div>
      </div>
    </div>
  )
}