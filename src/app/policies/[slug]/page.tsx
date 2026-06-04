import { notFound } from 'next/navigation'
import { policies } from '../content'

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const policy = policies[slug]
  if (!policy) return {}
  return { title: `${policy.title} — Sterrenlucht` }
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const policy = policies[slug]
  if (!policy) notFound()

  return (
    <>
      <h1
        className="mb-10 mt-16 font-normal italic tracking-tight text-[var(--foreground)]"
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}
      >
        {policy.title}
      </h1>
      <div className="border-t pt-10" style={{ borderColor: 'var(--border)' }}>
        {policy.body}
      </div>
    </>
  )
}
