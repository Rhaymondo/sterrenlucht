import { cookies } from 'next/headers'
import { createHash } from 'crypto'
import { LoginForm } from './login-form'
import { Dashboard } from './dashboard'
import { getOrders, getCodes } from './actions'

async function isAuthed(): Promise<boolean> {
  const store = await cookies()
  const token = store.get('sl_beheer')?.value
  const expected = createHash('sha256').update(process.env.BEHEER_PASSWORD ?? '').digest('hex')
  return token === expected
}

export default async function BeheerPage() {
  if (!(await isAuthed())) return <LoginForm />
  const [orders, codes] = await Promise.all([getOrders(), getCodes()])
  return <Dashboard orders={orders} codes={codes} />
}
