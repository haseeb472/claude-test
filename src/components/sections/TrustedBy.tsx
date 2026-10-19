import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper/types'
import 'swiper/css'
import {
  LOGO_BASELINE,
  trustedByHeading,
  trustedLogos,
} from '../../data/trustedBy'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import type { TrustedLogo } from '../../types/trustedBy'
import { Container } from '../ui/Container'

// Shifts each logo down so every text baseline lands on the same line.
function LogoImage({
  src,
  baseline,
  alt,
}: Pick<TrustedLogo, 'src' | 'baseline'> & { alt: string }) {
  return (
    <img src={src} alt={alt} style={{ marginTop: LOGO_BASELINE - baseline }} />
  )
}

// The logos repeat so the track is always wider than the screen plus one set.
const REPEATS = 5
const marqueeLogos = Array.from({ length: REPEATS }, (_, round) =>
  trustedLogos.map((logo) => ({ ...logo, key: `${logo.name}-${round}` })),
).flat()

const SLIDE_WIDTH = 80 // matches the `!w-20` slide class below
const PACE = 0.04 // pixels per millisecond

const marqueeBreakpoints = {
  768: { spaceBetween: 64 },
  1200: { spaceBetween: 96 },
}

// Moves the track by exactly one set of logos at a constant pace, then jumps
// back to the start. Every set is identical, so the jump cannot be seen.
const resetting = new WeakSet<SwiperInstance>()
const watchdogs = new WeakMap<SwiperInstance, number>()

// If `transitionEnd` is late or lost (hidden tab, resize), a timer restarts the
// marquee so it can never stay stuck at the end of a cycle.
const WATCHDOG_MARGIN = 500

function stopWatchdog(swiper: SwiperInstance) {
  window.clearTimeout(watchdogs.get(swiper))
  watchdogs.delete(swiper)
}

function runMarquee(swiper: SwiperInstance) {
  // Swiper also emits `transitionEnd` for the instant jump below.
  if (resetting.has(swiper) || swiper.destroyed) return

  const gap = Number(swiper.params.spaceBetween)
  const distance = trustedLogos.length * (SLIDE_WIDTH + gap)
  const duration = distance / PACE

  stopWatchdog(swiper)
  resetting.add(swiper)
  swiper.slideTo(0, 0, false)
  void swiper.wrapperEl.offsetWidth // apply the jump before the next move
  resetting.delete(swiper)

  swiper.slideTo(trustedLogos.length, duration, false)
  watchdogs.set(
    swiper,
    window.setTimeout(() => runMarquee(swiper), duration + WATCHDOG_MARGIN),
  )
}

export function TrustedBy() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section
      aria-labelledby="trusted-by-title"
      className="bg-white pb-1 pt-7.5 md:pb-14 md:pt-13.75"
    >
      <Container>
        <h2
          id="trusted-by-title"
          className="sr-only text-center text-nav font-semibold text-muted md:not-sr-only md:mb-8"
        >
          {trustedByHeading}
        </h2>
      </Container>

      {prefersReducedMotion ? (
        <Container>
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-6 md:gap-x-16 wide:gap-x-24">
            {trustedLogos.map(({ name, src, baseline }) => (
              <li key={name} className="flex h-8.25 items-start">
                <LogoImage src={src} baseline={baseline} alt={name} />
              </li>
            ))}
          </ul>
        </Container>
      ) : (
        <>
          <ul className="sr-only">
            {trustedLogos.map(({ name }) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <Swiper
            aria-hidden="true"
            className="marquee"
            slidesPerView="auto"
            spaceBetween={40}
            allowTouchMove={false}
            breakpoints={marqueeBreakpoints}
            onSwiper={runMarquee}
            onBreakpoint={runMarquee}
            onResize={runMarquee}
            onTransitionEnd={runMarquee}
            onDestroy={stopWatchdog}
          >
            {marqueeLogos.map(({ key, src, baseline }) => (
              <SwiperSlide
                key={key}
                className="!flex !h-8.25 !w-20 items-start justify-center"
              >
                <LogoImage src={src} baseline={baseline} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </section>
  )
}
