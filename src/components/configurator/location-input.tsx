'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapPin, Loader2, X } from 'lucide-react'
import { useConfigurator } from '@/store/configurator'

interface Suggestion {
  mapbox_id: string
  name: string
  full_address: string
  coordinates?: { longitude: number; latitude: number }
}

interface SuggestResponse {
  suggestions?: Suggestion[]
}

export function LocationInput() {
  const { location, setLocation, setPosterLabel } = useConfigurator()
  const [query, setQuery]             = useState(location?.label ?? '')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading]         = useState(false)
  const [open, setOpen]               = useState(false)
  const [sessionId]                   = useState(() => crypto.randomUUID())
  const debounce     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const justSelected = useRef(false)

  const search = useCallback(
    async (q: string) => {
      if (q.length < 2) { setSuggestions([]); return }
      setLoading(true)
      try {
        const res = await fetch(`/api/mapbox/suggest?q=${encodeURIComponent(q)}`, {
          headers: { 'x-session-id': sessionId },
        })
        const data: SuggestResponse = await res.json()
        setSuggestions(data.suggestions ?? [])
        setOpen(true)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    },
    [sessionId],
  )

  useEffect(() => {
    if (justSelected.current) { justSelected.current = false; return }
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => search(query), 320)
    return () => { if (debounce.current) clearTimeout(debounce.current) }
  }, [query, search])

  const select = (s: Suggestion) => {
    justSelected.current = true
    const label = s.full_address ?? s.name
    setQuery(label)
    setOpen(false)
    setSuggestions([])
    setLocation({
      label,
      lat:      s.coordinates?.latitude  ?? 0,
      lng:      s.coordinates?.longitude ?? 0,
      mapboxId: s.mapbox_id,
    })
    setPosterLabel(s.name)
  }

  const clear = () => {
    setQuery('')
    setLocation(null)
    setPosterLabel('')
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="relative">
      <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
        Locatie
      </label>
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!e.target.value) clear()
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 160)
            if (justSelected.current) return
            if (query.trim() && !location) {
              setLocation({ label: query.trim(), lat: 0, lng: 0, mapboxId: '' })
              setPosterLabel(query.trim())
            }
          }}
          placeholder="Bijv. Amsterdam, Vondelpark…"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-10 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--foreground)] focus:outline-none"
        />
        {loading ? (
          <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-[var(--muted)]" />
        ) : query ? (
          <button
            type="button"
            onClick={clear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] transition-opacity hover:opacity-60"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border bg-[var(--background)] shadow-lg"
            style={{ borderColor: 'var(--border)' }}
          >
            {suggestions.map((s) => (
              <li key={s.mapbox_id}>
                <button
                  type="button"
                  onMouseDown={() => select(s)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface)]"
                >
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-[var(--muted)]" />
                  <div>
                    <p className="text-[13px] font-medium leading-snug text-[var(--foreground)]">{s.name}</p>
                    <p className="text-[11px] text-[var(--muted)]">{s.full_address}</p>
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
