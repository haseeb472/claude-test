import clsx from 'clsx'
import { useRef, useState } from 'react'
import checkIcon from '../../assets/icons/check-mobile.svg'
import {
  billingOptions,
  defaultPlanId,
  pricingContent,
  pricingPlans,
} from '../../data/pricing'
import type { BillingPeriod, FeatureDensity } from '../../types/pricing'
import { Container } from '../ui/Container'

// The design spaces the feature list differently on each desktop card.
const densityClasses: Record<FeatureDensity, string> = {
  relaxed: 'md:gap-2 md:pt-4',
  regular: 'md:gap-1.5 md:pt-3',
  tight: 'md:gap-1.5 md:pt-2',
}

const nameId = (id: string) => `plan-name-${id}`
const descriptionId = (id: string) => `plan-description-${id}`
const priceId = (id: string) => `plan-price-${id}`

export function Pricing() {
  const [billing, setBilling] = useState<BillingPeriod>('monthly')
  const [selectedId, setSelectedId] = useState(defaultPlanId)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLLabelElement | null>>({})

  const selectPlan = (id: string) => {
    setSelectedId(id)

    // On mobile the cards scroll sideways: bring the chosen one to the left
    // edge. Only the row scrolls, never the page.
    const scroller = scrollerRef.current
    const card = cardRefs.current[id]
    if (!scroller || !card) return

    const gutter = parseFloat(getComputedStyle(scroller).paddingLeft) || 0
    scroller.scrollTo?.({ left: card.offsetLeft - gutter, behavior: 'smooth' })
  }

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="bg-white pb-8 pt-6 md:py-20"
    >
      <Container>
        <div className="md:mx-auto md:mb-14 md:max-w-2xl md:text-center">
          <h2
            id="pricing-title"
            className="mb-3 text-section-title-sm text-ink md:mb-2 md:text-pricing-title"
          >
            {pricingContent.title}
          </h2>
          <p className="pb-1.75 pt-1.5 text-small text-muted md:p-0 md:text-body">
            {pricingContent.subtitle}
          </p>

          <div
            role="group"
            aria-label={pricingContent.billingLabel}
            className="my-3.125 flex gap-2 md:mb-0 md:mt-6 md:justify-center"
          >
            {billingOptions.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={billing === id}
                onClick={() => setBilling(id)}
                className="group relative overflow-hidden rounded-button border border-line bg-white px-5.25 py-2 text-small font-semibold text-ink transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-blue aria-pressed:text-white"
              >
                <span
                  aria-hidden="true"
                  className="absolute -inset-px bg-brand-gradient opacity-0 transition-opacity duration-300 group-aria-pressed:opacity-100"
                />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* A sideways-scrolling row on mobile, three columns from `md`. */}
        <div
          ref={scrollerRef}
          role="radiogroup"
          aria-label={pricingContent.plansLabel}
          className="no-scrollbar relative -mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-6 overflow-x-auto px-gutter md:mx-0 md:grid md:grid-cols-3 md:gap-x-10.5 md:overflow-visible md:px-0 md:pb-3.5 md:pt-7.5"
        >
          {pricingPlans.map((plan) => {
            const isSelected = plan.id === selectedId

            return (
              <label
                key={plan.id}
                ref={(element) => {
                  cardRefs.current[plan.id] = element
                }}
                data-active={isSelected}
                className={clsx(
                  'group relative flex shrink-0 basis-pricing-card cursor-pointer snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 ease-out has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-blue data-[active=true]:border-brand-blue data-[active=true]:ring-1 data-[active=true]:ring-inset data-[active=true]:ring-brand-blue data-[active=false]:hover:border-brand-blue/50 md:basis-auto md:shadow-none md:data-[active=true]:shadow-raised',
                  // The featured plan comes first on mobile, as in the design.
                  plan.badge && 'order-first md:order-none',
                )}
              >
                <input
                  type="radio"
                  name="pricing-plan"
                  value={plan.id}
                  checked={isSelected}
                  onChange={() => selectPlan(plan.id)}
                  aria-labelledby={nameId(plan.id)}
                  aria-describedby={`${priceId(plan.id)} ${descriptionId(plan.id)}`}
                  className="sr-only"
                />

                {plan.badge && (
                  <span
                    className={clsx(
                      'flex items-center justify-center bg-brand-gradient py-1.5 text-small font-bold tracking-wide text-white transition-opacity duration-300',
                      !isSelected && 'opacity-0',
                    )}
                  >
                    {plan.badge}
                  </span>
                )}

                <div
                  className={clsx(
                    'flex flex-1 flex-col p-6',
                    plan.badge && 'md:pt-2',
                  )}
                >
                  <h3
                    id={nameId(plan.id)}
                    className="text-base font-bold text-ink md:mb-1"
                  >
                    {plan.name}
                  </h3>

                  {/* Both prices sit in one cell, so switching never moves the card. */}
                  <div
                    id={priceId(plan.id)}
                    className="mb-0.5 grid pt-1 md:mb-1"
                  >
                    {billingOptions.map(({ id }) => {
                      const { amount, unit } = plan.prices[id]
                      const isActive = billing === id

                      return (
                        <p
                          key={id}
                          aria-hidden={!isActive}
                          data-active={isActive}
                          className="tab-panel col-start-1 row-start-1 flex items-baseline gap-1 whitespace-nowrap"
                        >
                          <span className="text-price-sm font-bold text-ink md:text-price">
                            {amount}
                          </span>
                          <span className="text-small font-medium text-muted">
                            {unit}
                          </span>
                        </p>
                      )
                    })}
                  </div>

                  <p
                    id={descriptionId(plan.id)}
                    className="mb-5 text-small text-muted md:mb-1"
                  >
                    {plan.description}
                  </p>

                  <ul
                    className={clsx(
                      'mb-6 flex flex-col gap-2.5 md:mb-1',
                      densityClasses[plan.density],
                    )}
                  >
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-small text-muted md:gap-2"
                      >
                        <img src={checkIcon} alt="" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={pricingContent.cta.href}
                    onClick={() => selectPlan(plan.id)}
                    className="relative mt-auto block overflow-hidden rounded-button border border-line bg-white py-2.3125 text-center text-nav font-semibold text-ink transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue group-data-[active=true]:border-transparent group-data-[active=true]:text-white group-data-[active=true]:shadow-button group-data-[active=false]:hover:border-brand-blue group-data-[active=false]:hover:text-brand-blue"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -inset-px bg-brand-gradient opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100"
                    />
                    <span className="relative">{pricingContent.cta.label}</span>
                  </a>
                </div>
              </label>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
