'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useConfigurator } from '@/store/configurator'

const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MONTHS = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
]

function parseDate(value: string | null): Date | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplay(value: string | null): string {
  if (!value) return 'Kies een datum'
  const d = parseDate(value)
  if (!d) return 'Kies een datum'
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// Monday = 0, Sunday = 6
function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function DateCalendar({
  value,
  onChange,
  onClose,
}: {
  value: string | null
  onChange: (v: string) => void
  onClose: () => void
}) {
  const today = new Date()
  const selected = parseDate(value)
  const [view, setView] = useState<{ year: number; month: number }>(() => {
    const d = selected ?? today
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [mode, setMode] = useState<'calendar' | 'year'>('calendar')

  const years = Array.from(
    { length: today.getFullYear() - 1900 + 1 },
    (_, i) => today.getFullYear() - i,
  )

  const daysInMonth = getDaysInMonth(view.year, view.month)
  const firstDay = getFirstDayOfWeek(view.year, view.month)

  const prevMonth = () =>
    setView(v =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: v.month - 1 },
    )

  const nextMonth = () => {
    const next =
      view.month === 11
        ? { year: view.year + 1, month: 0 }
        : { year: view.year, month: view.month + 1 }
    const nextFirst = new Date(next.year, next.month, 1)
    if (nextFirst > today) return
    setView(next)
  }

  const canGoNext = () => {
    const nextYear = view.month === 11 ? view.year + 1 : view.year
    const nextMonth = view.month === 11 ? 0 : view.month + 1
    return new Date(nextYear, nextMonth, 1) <= today
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isDisabled = (day: number) =>
    new Date(view.year, view.month, day) > today

  const isSelected = (day: number) =>
    selected?.getFullYear() === view.year &&
    selected?.getMonth() === view.month &&
    selected?.getDate() === day

  const isToday = (day: number) =>
    today.getFullYear() === view.year &&
    today.getMonth() === view.month &&
    today.getDate() === day

  if (mode === 'year') {
    return (
      <div className="w-72 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground)]">
            Kies een jaar
          </span>
          <button
            type="button"
            onClick={() => setMode('calendar')}
            className="text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {years.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => {
                setView(v => ({ ...v, year: y }))
                setMode('calendar')
              }}
              className={[
                'rounded-lg py-1.5 text-center text-[12px] tabular-nums transition-colors',
                y === view.year
                  ? 'bg-[var(--foreground)] font-medium text-[var(--background)]'
                  : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]',
              ].join(' ')}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setMode('year')}
          className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground)] transition-opacity hover:opacity-60"
        >
          {MONTHS[view.month]} {view.year}
        </button>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext()}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)] disabled:opacity-25"
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS.map(d => (
          <div
            key={d}
            className="text-center text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              disabled={isDisabled(day)}
              onClick={() => {
                onChange(formatDate(new Date(view.year, view.month, day)))
                onClose()
              }}
              className={[
                'flex h-8 w-8 items-center justify-center rounded-full text-[12px] transition-colors',
                isSelected(day)
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : isToday(day)
                    ? 'border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)]'
                    : 'text-[var(--foreground)] hover:bg-[var(--surface)]',
                isDisabled(day) ? 'cursor-not-allowed opacity-20' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

function ScrollColumn({
  items,
  selected,
  onSelect,
}: {
  items: string[]
  selected: string
  onSelect: (v: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll selected item into the centre on mount and when it changes
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLButtonElement>('[data-selected="true"]')
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [selected])

  return (
    <div
      ref={listRef}
      className="flex h-40 flex-col overflow-y-auto overscroll-contain scroll-smooth"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* padding so first/last items can reach centre */}
      <div className="py-[60px]">
        {items.map(item => (
          <button
            key={item}
            type="button"
            data-selected={item === selected}
            onClick={() => onSelect(item)}
            className={[
              'w-full rounded-lg py-1.5 text-center text-[14px] tabular-nums transition-colors',
              item === selected
                ? 'bg-[var(--foreground)] font-medium text-[var(--background)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]',
            ].join(' ')}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

function TimeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [hh, mm] = value.split(':')

  const hours   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'w-full rounded-xl border px-4 py-3 text-left text-[13px] transition-colors focus:outline-none',
          open
            ? 'border-[var(--foreground)] bg-[var(--surface)]'
            : 'border-[var(--border)] bg-[var(--surface)]',
          'text-[var(--foreground)]',
        ].join(' ')}
      >
        {hh}:{mm}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-50 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 shadow-xl"
          >
            {/* Column labels */}
            <div className="mb-2 grid grid-cols-2 gap-2">
              <span className="text-center text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">Uur</span>
              <span className="text-center text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">Min</span>
            </div>

            {/* Separator line in the middle */}
            <div className="relative">
              {/* Fade top */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-[var(--background)] to-transparent" />
              {/* Fade bottom */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-[var(--background)] to-transparent" />

              <div className="grid grid-cols-2 gap-2">
                <ScrollColumn
                  items={hours}
                  selected={hh}
                  onSelect={h => onChange(`${h}:${mm}`)}
                />
                <ScrollColumn
                  items={minutes}
                  selected={mm}
                  onSelect={m => onChange(`${hh}:${m}`)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DateTimePicker() {
  const { date, time, setDate, setTime } = useConfigurator()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Date */}
      <div>
        <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
          Datum
        </label>
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className={[
              'w-full rounded-xl border px-4 py-3 text-left text-[13px] transition-colors focus:outline-none',
              open
                ? 'border-[var(--foreground)] bg-[var(--surface)]'
                : 'border-[var(--border)] bg-[var(--surface)]',
              date ? 'text-[var(--foreground)]' : 'text-[var(--muted)]',
            ].join(' ')}
          >
            {formatDisplay(date)}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-full z-50 mt-2"
              >
                <DateCalendar
                  value={date}
                  onChange={v => setDate(v)}
                  onClose={() => setOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Time */}
      <div>
        <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
          Tijdstip
        </label>
        <TimeSelect value={time} onChange={setTime} />
      </div>
    </div>
  )
}
