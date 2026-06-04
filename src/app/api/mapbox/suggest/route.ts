import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q || q.length < 2) return NextResponse.json({ suggestions: [] })

  const apiKey = process.env.MAPBOX_SECRET_TOKEN
  if (!apiKey) {
    return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 })
  }

  const url = new URL('https://api.mapbox.com/search/searchbox/v1/suggest')
  url.searchParams.set('q', q)
  url.searchParams.set('access_token', apiKey)
  url.searchParams.set('session_token', req.headers.get('x-session-id') ?? crypto.randomUUID())
  url.searchParams.set('language', 'nl')
  url.searchParams.set('limit', '5')
  url.searchParams.set('types', 'place,address,poi,region')

  try {
    const res  = await fetch(url.toString(), { next: { revalidate: 0 } })
    const data = await res.json() as unknown

    if (!res.ok) return NextResponse.json({ suggestions: [] }, { status: res.status })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ suggestions: [] }, { status: 500 })
  }
}
