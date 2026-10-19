import { render, screen } from '@testing-library/react'
import { features } from '../../data/features'
import { FeatureCard } from './FeatureCard'

const [planning, aiSuggestions, , automated] = features

describe('FeatureCard', () => {
  it('renders the title as a level 3 heading', () => {
    render(<FeatureCard {...planning} />)

    expect(
      screen.getByRole('heading', { level: 3, name: planning.title }),
    ).toBeInTheDocument()
  })

  it('renders both the desktop and the shorter mobile description', () => {
    render(<FeatureCard {...planning} />)

    expect(screen.getByText(planning.description)).toHaveClass('hidden')
    expect(screen.getByText(planning.shortDescription)).toHaveClass('md:hidden')
  })

  it('renders image icons as decorative images', () => {
    const { container } = render(<FeatureCard {...planning} />)

    const images = container.querySelectorAll('img')
    expect(images).toHaveLength(2)
    images.forEach((image) => expect(image).toHaveAttribute('alt', ''))
  })

  it('renders glyph icons hidden from assistive technology', () => {
    render(<FeatureCard {...aiSuggestions} />)

    const glyph = screen.getByText('AI')
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
    expect(glyph).toHaveClass('bg-accent-violet')
  })

  it('uses a single image when desktop and mobile icons are identical', () => {
    const [, , collaboration] = features
    const { container } = render(<FeatureCard {...collaboration} />)

    expect(container.querySelectorAll('img')).toHaveLength(1)
  })

  it('renders a card with a glyph icon and no image', () => {
    const { container } = render(<FeatureCard {...automated} />)

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(screen.getByText('⚙')).toHaveClass('bg-accent-orange')
  })
})
