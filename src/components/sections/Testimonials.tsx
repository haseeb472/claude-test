import clsx from 'clsx'
import { useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { testimonials, testimonialsContent } from '../../data/testimonials'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Container } from '../ui/Container'
import { ResponsiveText } from '../ui/ResponsiveText'

// Below `md` the buttons are hidden and the slides change by dragging instead.
const SWIPE_QUERY = '(max-width: 767.98px)'
const SWIPE_DISTANCE = 40

// Hidden below `md`; shown as a flex box from `md` up.
const arrowClasses =
  'hidden items-center justify-center rounded-button border border-line bg-white px-4.0625 py-1.625 text-carousel-arrow font-semibold text-ink transition duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue enabled:active:scale-95 enabled:hover:border-brand-blue enabled:hover:bg-pill enabled:hover:text-brand-blue enabled:hover:shadow-button disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex'

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const lastIndex = testimonials.length - 1
  const isSwipeEnabled = useMediaQuery(SWIPE_QUERY)
  const dragStart = useRef<{ x: number; y: number } | null>(null)

  const goBy = (offset: number) =>
    setActiveIndex((index) => Math.min(lastIndex, Math.max(0, index + offset)))

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isSwipeEnabled) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    dragStart.current = { x: event.clientX, y: event.clientY }
    // Keeps a mouse drag working when the pointer leaves the card. It can throw
    // if the pointer is already gone, which is safe to ignore.
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // The drag still works without capture.
    }
  }

  // The slide changes as soon as a mostly horizontal drag is long enough, once
  // per drag, so it feels instant and can never double-trigger.
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current
    if (!start) return

    const dragX = event.clientX - start.x
    const dragY = event.clientY - start.y
    if (Math.abs(dragX) < SWIPE_DISTANCE || Math.abs(dragX) < Math.abs(dragY))
      return

    dragStart.current = null
    goBy(dragX < 0 ? 1 : -1)
  }

  const stopDrag = () => {
    dragStart.current = null
  }

  // The keyboard way to change slides when the buttons are hidden.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goBy(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goBy(-1)
    }
  }

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="bg-white pb-6 pt-13 md:py-20"
    >
      <Container>
        <div
          role="group"
          aria-roledescription="carousel"
          aria-labelledby="testimonials-title"
          className="flex flex-wrap items-center gap-x-3.5 gap-y-4.5 md:justify-center md:gap-y-10 wide:flex-nowrap wide:justify-between"
        >
          <div className="w-full wide:w-auto wide:min-w-0 wide:flex-1">
            <p className="mb-2 text-nav font-bold uppercase tracking-wide text-brand-blue">
              {testimonialsContent.eyebrow}
            </p>
            <h2
              id="testimonials-title"
              className="mb-7 text-testimonial-title-sm text-ink md:mb-2.75 md:text-testimonial-title"
            >
              {testimonialsContent.title}
            </h2>
            <p className="text-section-lead text-muted">
              {testimonialsContent.subtitle}
            </p>
          </div>

          <button
            type="button"
            aria-label={testimonialsContent.previousLabel}
            disabled={activeIndex === 0}
            onClick={() => goBy(-1)}
            className={clsx(
              arrowClasses,
              'order-3 enabled:hover:-translate-x-0.5 md:order-2',
            )}
          >
            <span aria-hidden="true" className="inline-block rotate-180">
              ›
            </span>
          </button>

          <div
            role="group"
            tabIndex={0}
            aria-label={testimonialsContent.slidesLabel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onKeyDown={handleKeyDown}
            className="relative order-2 w-full touch-pan-y rounded-card bg-hero-gradient p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue max-md:cursor-grab max-md:select-none md:order-3 md:max-w-testimonial md:border md:border-line md:bg-white md:bg-none md:p-8 md:shadow-testimonial"
          >
            <span
              aria-hidden="true"
              className="-mt-2 mb-1 block text-quote-mark-sm font-bold text-brand-violet md:absolute md:left-6 md:top-4 md:m-0 md:text-quote-mark"
            >
              “
            </span>

            <div aria-live="polite" className="grid overflow-hidden">
              {testimonials.map(({ quote, shortQuote, name, role }, index) => {
                const position =
                  index < activeIndex
                    ? 'before'
                    : index > activeIndex
                      ? 'after'
                      : 'active'
                const isActive = position === 'active'

                return (
                  <figure
                    key={name}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${testimonials.length}`}
                    aria-hidden={!isActive}
                    inert={!isActive}
                    data-position={position}
                    className="testimonial-slide col-start-1 row-start-1"
                  >
                    <blockquote className="mb-8.5 text-quote-sm font-medium text-ink md:mb-9.5 md:pl-7 md:pt-1.75 md:text-quote">
                      <ResponsiveText full={quote} short={shortQuote} />
                    </blockquote>
                    <figcaption className="flex items-center justify-between pt-4 md:pl-7 md:pt-0">
                      <div>
                        <p className="text-small font-bold text-ink md:text-nav">
                          {name}
                        </p>
                        <p className="text-role-sm text-muted md:text-caption">
                          {role}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="hidden text-body tracking-widest text-star md:block"
                      >
                        ★★★★★
                      </span>
                      <span className="sr-only">Rated 5 out of 5</span>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label={testimonialsContent.nextLabel}
            disabled={activeIndex === lastIndex}
            onClick={() => goBy(1)}
            className={clsx(
              arrowClasses,
              'order-4 enabled:hover:translate-x-0.5',
            )}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </Container>
    </section>
  )
}
