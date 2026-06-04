import { Nav } from '@/components/nav'
import { Hero } from '@/components/landing/hero'
import { VideoSection } from '@/components/landing/video-section'
import { Testimonials } from '@/components/landing/testimonials'
import { CtaSection } from '@/components/landing/cta-section'
import { PosterSection } from '@/components/landing/poster-section'

export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <VideoSection />
      <Testimonials />
      <PosterSection />
      <CtaSection />
    </>
  )
}
