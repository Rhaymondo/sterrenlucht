import { Nav } from '@/components/nav'

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-8 py-16">
        {children}
      </main>
    </>
  )
}
