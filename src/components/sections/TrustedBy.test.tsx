import { render, screen, within } from '@testing-library/react'
import {
  LOGO_BASELINE,
  trustedByHeading,
  trustedLogos,
} from '../../data/trustedBy'
import { TrustedBy } from './TrustedBy'

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('TrustedBy', () => {
  it('renders the heading and labels the section with it', () => {
    render(<TrustedBy />)

    expect(
      screen.getByRole('heading', { level: 2, name: trustedByHeading }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: trustedByHeading }),
    ).toBeInTheDocument()
  })

  it('names every company once for assistive technology', () => {
    render(<TrustedBy />)

    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')

    expect(items).toHaveLength(trustedLogos.length)
    trustedLogos.forEach(({ name }) => {
      expect(within(list).getByText(name)).toBeInTheDocument()
    })
  })

  it('renders the logos in a slider hidden from assistive technology', () => {
    const { container } = render(<TrustedBy />)

    const slider = container.querySelector('.swiper')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('aria-hidden', 'true')
    expect(slider).toHaveClass('marquee')

    const images = slider?.querySelectorAll('img') ?? []
    expect(images.length).toBeGreaterThanOrEqual(trustedLogos.length)
    images.forEach((image) => expect(image).toHaveAttribute('alt', ''))
  })

  it('shows a static list with named logos when reduced motion is preferred', () => {
    mockReducedMotion(true)
    const { container } = render(<TrustedBy />)

    expect(container.querySelector('.swiper')).not.toBeInTheDocument()
    trustedLogos.forEach(({ name }) => {
      expect(screen.getByRole('img', { name })).toBeInTheDocument()
    })
  })

  it('aligns every logo on the same text baseline', () => {
    const { container } = render(<TrustedBy />)

    const images = container.querySelectorAll<HTMLImageElement>('.swiper img')
    trustedLogos.forEach(({ baseline }, index) => {
      expect(images[index]).toHaveStyle({
        marginTop: `${LOGO_BASELINE - baseline}px`,
      })
    })
  })

  it('keeps the static list inside the page container', () => {
    mockReducedMotion(true)
    render(<TrustedBy />)

    expect(screen.getByRole('list').closest('.container')).toBeInTheDocument()
  })

  it('keeps the slider when reduced motion is not preferred', () => {
    mockReducedMotion(false)
    const { container } = render(<TrustedBy />)

    expect(container.querySelector('.swiper')).toBeInTheDocument()
  })
})
