'use client'

import { useState, useActionState, useTransition, useEffect } from 'react'
import { sendShipping, logout, toggleCode, deleteCode, createCode, type Order, type DiscountCode } from './actions'
import { Loader2, CheckCircle, ArrowLeft, Package, Tag, Mail, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { SterrenluchtLogo } from '@/components/sterrenlucht-logo'

function formatDate(unix: number) {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(unix * 1000))
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function formatOrderDate(dateStr: string) {
  if (!dateStr) return null
  try {
    return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
  } catch { return dateStr }
}

// ── Shipping form ─────────────────────────────────────────────────────────────

function ShippingForm({ order, onBack }: { order: Order; onBack: () => void }) {
  const [state, action, pending] = useActionState(sendShipping, {})

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <CheckCircle className="mb-4 size-8 text-[var(--foreground)]" />
        <p className="text-[15px] font-medium text-[var(--foreground)]">Verzendmail verstuurd!</p>
        <button onClick={onBack} className="mt-6 text-[11px] uppercase tracking-[.18em] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
          ← Terug naar bestellingen
        </button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="size-3" /> Bestellingen
      </button>

      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">Verzendmail</p>
      <p className="mb-6 text-[15px] font-medium text-[var(--foreground)]">{order.customerName ?? order.customerEmail}</p>

      <form action={action} className="space-y-4">
        <input type="hidden" name="email" value={order.customerEmail ?? ''} />
        <input type="hidden" name="customerName" value={order.customerName ?? order.customerEmail ?? ''} />

        <div className="rounded border border-[var(--border)] bg-[var(--surface)] px-4 py-3 space-y-0.5">
          <p className="text-[11px] text-[var(--muted)]">Naar</p>
          <p className="text-[13px] text-[var(--foreground)]">{order.customerEmail}</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">Track & trace URL</label>
          <input type="url" name="trackingUrl" required autoFocus placeholder="https://postnl.nl/track/..."
            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">
            Verzendpartij <span className="normal-case">(optioneel)</span>
          </label>
          <input type="text" name="carrier" placeholder="PostNL"
            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none" />
        </div>

        {state.error && <p className="text-[12px] text-red-500">{state.error}</p>}

        <button type="submit" disabled={pending}
          className="w-full bg-[var(--foreground)] py-3 text-[11px] uppercase tracking-[.22em] text-[var(--background)] transition-opacity hover:opacity-75 disabled:opacity-30">
          {pending ? <Loader2 className="mx-auto size-3.5 animate-spin" /> : 'Verstuur mail'}
        </button>
      </form>
    </div>
  )
}

// ── Order card ────────────────────────────────────────────────────────────────

function OrderCard({ order, onShip }: { order: Order; onShip: (o: Order) => void }) {
  const [open, setOpen] = useState(false)
  const ref = order.id.slice(-8).toUpperCase()

  return (
    <div className="border border-[var(--border)] bg-white">
      <button onClick={() => setOpen(v => !v)} className="flex w-full items-start justify-between px-4 py-4 text-left">
        <div className="space-y-0.5">
          <p className="text-[13px] font-medium text-[var(--foreground)]">{order.customerName ?? order.customerEmail ?? '–'}</p>
          <p className="text-[11px] text-[var(--muted)]">{formatDate(order.created)}</p>
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-[13px] text-[var(--foreground)]">{formatMoney(order.amount)}</p>
          <p className="text-[10px] uppercase tracking-[.1em] text-[var(--muted)]">#{ref}</p>
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--border)] px-4 pb-4 pt-3 space-y-3">
          {order.customerEmail && <p className="text-[12px] text-[var(--muted)]">{order.customerEmail}</p>}

          {order.items.length > 0 && (
            <div className="space-y-1.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] text-[var(--foreground)]">{item.l || '–'}</p>
                    {item.d && <p className="text-[11px] text-[var(--muted)]">{formatOrderDate(item.d)} · {item.f === 'digital' ? 'Digitaal' : 'Gedrukt'}</p>}
                  </div>
                  <p className="text-[12px] text-[var(--muted)] shrink-0">{formatMoney(item.p)}</p>
                </div>
              ))}
            </div>
          )}

          {order.shipping && (
            <p className="text-[11px] text-[var(--muted)]">
              {order.shipping.line1}, {order.shipping.postal_code} {order.shipping.city}
            </p>
          )}

          {order.hasPhysical && (
            <button onClick={() => onShip(order)}
              className="flex items-center gap-2 border border-[var(--foreground)] px-3 py-2 text-[11px] uppercase tracking-[.14em] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
              <Mail className="size-3" /> Verstuur verzendmail
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Discount codes tab ────────────────────────────────────────────────────────

function DiscountCodesTab({ initialCodes, isActive }: { initialCodes: DiscountCode[]; isActive: boolean }) {
  const [codes, setCodes] = useState(initialCodes)
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const refreshCodes = () => {
    startTransition(async () => {
      const { getCodes } = await import('./actions')
      setCodes(await getCodes())
    })
  }

  useEffect(() => {
    if (isActive) refreshCodes()
  }, [isActive])
  const [createState, createAction, createPending] = useActionState(createCode, undefined)

  useEffect(() => {
    if (createState?.success) {
      setShowForm(false)
      refreshCodes()
    }
  }, [createState])

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleCode(id, !current)
      refreshCodes()
    })
  }

  const handleDelete = (couponId: string) => {
    startTransition(async () => {
      await deleteCode(couponId)
      refreshCodes()
    })
  }

  return (
    <div className="space-y-4">
      {codes.length === 0 && !showForm && (
        <p className="text-[13px] text-[var(--muted)]">Nog geen kortingscodes.</p>
      )}

      {codes.map(code => (
        <div key={code.id} className="border border-[var(--border)] bg-white px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium tracking-widest text-[var(--foreground)]">{code.code}</p>
                <span className={`text-[10px] uppercase tracking-[.1em] px-1.5 py-0.5 rounded ${code.active ? 'bg-green-100 text-green-700' : 'bg-[var(--surface)] text-[var(--muted)]'}`}>
                  {code.active ? 'Actief' : 'Inactief'}
                </span>
              </div>
              <p className="text-[12px] text-[var(--muted)]">
                {code.type === 'percentage' ? `${code.value}% korting` : `${formatMoney(code.value)} korting`}
                {code.maxRedemptions != null && ` · ${code.timesRedeemed}/${code.maxRedemptions} gebruikt`}
                {code.expiresAt && ` · Verlopen op ${formatDate(code.expiresAt)}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleToggle(code.id, code.active)} disabled={isPending}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40">
                {code.active ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
              </button>
              <button onClick={() => handleDelete(code.couponId)} disabled={isPending}
                className="text-[var(--muted)] hover:text-red-500 transition-colors disabled:opacity-40">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {showForm ? (
        <form action={createAction} className="border border-[var(--border)] bg-white p-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">Nieuwe kortingscode</p>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-[.12em] text-[var(--muted)]">Code</label>
            <input type="text" name="code" required placeholder="ZOMER10"
              className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[13px] uppercase tracking-widest text-[var(--foreground)] placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-[.12em] text-[var(--muted)]">Type</label>
              <select name="type" className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[13px] text-[var(--foreground)] focus:border-[var(--foreground)] focus:outline-none">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Vast bedrag (€)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-[.12em] text-[var(--muted)]">Waarde</label>
              <input type="number" name="value" required min="1" placeholder="10"
                className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-[.12em] text-[var(--muted)]">Max gebruik <span className="normal-case">(opt.)</span></label>
              <input type="number" name="maxUses" min="1" placeholder="–"
                className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-[.12em] text-[var(--muted)]">Vervaldatum <span className="normal-case">(opt.)</span></label>
              <input type="date" name="expiresAt"
                className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[13px] text-[var(--foreground)] focus:border-[var(--foreground)] focus:outline-none" />
            </div>
          </div>

          {createState?.error && <p className="text-[12px] text-red-500">{createState?.error}</p>}

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={createPending}
              className="flex-1 bg-[var(--foreground)] py-2.5 text-[11px] uppercase tracking-[.18em] text-[var(--background)] hover:opacity-75 disabled:opacity-30 transition-opacity">
              {createPending ? <Loader2 className="mx-auto size-3.5 animate-spin" /> : 'Aanmaken'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="border border-[var(--border)] px-4 py-2.5 text-[11px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Annuleren
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full border border-dashed border-[var(--border)] py-3 text-[11px] uppercase tracking-[.18em] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-colors">
          + Nieuwe code
        </button>
      )}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function Dashboard({ orders, codes }: { orders: Order[]; codes: DiscountCode[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [tab, setTab] = useState<'orders' | 'codes'>('orders')

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-sm">

        <div className="mb-8 flex items-center justify-between">
          <SterrenluchtLogo width={120} height={17} />
          <form action={logout}>
            <button type="submit" className="text-[11px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Uitloggen
            </button>
          </form>
        </div>

        {selectedOrder ? (
          <ShippingForm order={selectedOrder} onBack={() => setSelectedOrder(null)} />
        ) : (
          <>
            {/* Tab bar */}
            <div className="mb-6 flex border-b border-[var(--border)]">
              <button
                onClick={() => setTab('orders')}
                className={`flex items-center gap-1.5 pb-3 pr-6 text-[11px] uppercase tracking-[.14em] transition-colors ${tab === 'orders' ? 'border-b-2 border-[var(--foreground)] text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
              >
                <Package className="size-3" /> Bestellingen
              </button>
              <button
                onClick={() => setTab('codes')}
                className={`flex items-center gap-1.5 pb-3 text-[11px] uppercase tracking-[.14em] transition-colors ${tab === 'codes' ? 'border-b-2 border-[var(--foreground)] text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
              >
                <Tag className="size-3" /> Kortingscodes
              </button>
            </div>

            {tab === 'orders' && (
              orders.length === 0
                ? <p className="text-[13px] text-[var(--muted)]">Geen bestellingen gevonden.</p>
                : <div className="space-y-2">
                    {orders.map(order => (
                      <OrderCard key={order.id} order={order} onShip={setSelectedOrder} />
                    ))}
                  </div>
            )}

            {tab === 'codes' && <DiscountCodesTab initialCodes={codes} isActive={tab === 'codes'} />}
          </>
        )}
      </div>
    </div>
  )
}
