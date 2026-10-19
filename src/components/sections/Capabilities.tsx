import { features, featuresContent } from '../../data/features'
import { Container } from '../ui/Container'
import { FeatureCard } from '../ui/FeatureCard'

export function Capabilities() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="bg-white py-4 md:py-16"
    >
      <Container>
        <div className="mb-5 md:mx-auto md:mb-12 md:flex md:max-w-3xl md:flex-col md:gap-2.75 md:text-center">
          <h2
            id="features-title"
            className="text-section-title-sm text-ink md:text-section-title"
          >
            {featuresContent.title}
          </h2>
          <p className="hidden text-section-lead text-muted md:block">
            {featuresContent.subtitle}
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 md:gap-6 wide:grid-cols-4">
          {features.map((feature) => (
            <li key={feature.title}>
              <FeatureCard {...feature} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
