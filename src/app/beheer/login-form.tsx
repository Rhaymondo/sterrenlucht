'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Loader2 } from 'lucide-react'
import { SterrenluchtLogo } from '@/components/sterrenlucht-logo'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {})

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <SterrenluchtLogo width={167} height={24} />
        </div>

        <form action={action} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Wachtwoord"
            required
            autoFocus
            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none"
          />

          {state.error && (
            <p className="text-[12px] text-red-500">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[var(--foreground)] py-3 text-[11px] uppercase tracking-[.22em] text-[var(--background)] transition-opacity hover:opacity-75 disabled:opacity-30"
          >
            {pending ? <Loader2 className="mx-auto size-3.5 animate-spin" /> : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  )
}
