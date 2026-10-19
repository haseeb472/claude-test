import checkDesktop from '../../../assets/icons/check-desktop.svg'
import checkMobile from '../../../assets/icons/check-mobile.svg'
import { heroChecks, heroContent } from '../../../data/hero'
import { ButtonLink } from '../../ui/ButtonLink'
import { Container } from '../../ui/Container'
import { DashboardMockup } from './DashboardMockup'

export function Hero() {
  const { badge, title, subtitle, primaryCta, secondaryCta } = heroContent

  return (
    <section
      aria-labelledby="hero-title"
      className="bg-hero-gradient pb-10 pt-8 md:py-16 wide:flex wide:min-h-150 wide:items-center wide:py-0"
    >
      <Container className="flex flex-col wide:flex-row wide:items-center wide:justify-between wide:gap-8">
        <div className="mb-8 md:mb-10 md:w-hero-copy wide:mb-0 wide:shrink-0">
          <div className="mb-6 md:mb-7">
            <p className="flex h-6.5 w-fit items-center gap-2 rounded-full bg-pill px-2.5 text-badge-sm md:h-7 md:px-3.5 md:text-caption">
              <span className="font-bold text-brand-blue">{badge.tag}</span>
              <span className="font-medium text-muted">{badge.text}</span>
            </p>
          </div>

          <h1
            id="hero-title"
            className="mb-4 text-hero-title-sm text-ink md:mb-5 md:text-hero-title"
          >
            <span className="block">{title.first}</span>
            {title.second} <br className="md:hidden" />
            {title.third}
          </h1>

          <p className="mb-7 max-w-lg pr-8 text-sm text-muted md:mb-8 md:pr-0 md:text-lead">
            {subtitle}
          </p>

          <div className="mb-8 flex gap-3.5 md:mb-9 md:gap-4">
            <ButtonLink
              href={primaryCta.href}
              size="lg"
              className="flex-1 md:w-37.5 md:flex-none"
            >
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={secondaryCta.href}
              variant="outline"
              size="lg"
              className="flex-1 md:w-42.5 md:flex-none"
            >
              {secondaryCta.label}
            </ButtonLink>
          </div>

          <ul className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2">
            {heroChecks.map(({ label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-small text-muted md:gap-2 md:text-nav"
              >
                <img src={checkMobile} alt="" className="md:hidden" />
                <img src={checkDesktop} alt="" className="hidden md:block" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:max-w-mockup wide:min-w-0 wide:flex-1">
          <DashboardMockup />
        </div>
      </Container>
    </section>
  )
}
