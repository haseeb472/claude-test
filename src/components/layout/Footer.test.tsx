import { render, screen, within } from '@testing-library/react'
import { footerContent, footerLinks } from '../../data/footer'
import { Footer } from './Footer'

describe('Footer', () => {
  it('is the page footer landmark', () => {
    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('has a logo that links back to the top', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: /flowpilot/i })).toHaveAttribute(
      'href',
      '#top',
    )
  })

  it('shows the full copyright on desktop and the short one on mobile', () => {
    render(<Footer />)

    expect(screen.getByText(footerContent.copyright)).toHaveClass(
      'hidden',
      'md:inline',
    )
    expect(screen.getByText(footerContent.shortCopyright)).toHaveClass(
      'md:hidden',
    )
  })

  it('lists the footer links', () => {
    render(<Footer />)

    const nav = screen.getByRole('navigation', { name: footerContent.navLabel })
    expect(within(nav).getAllByRole('link')).toHaveLength(footerLinks.length)
    footerLinks.forEach(({ label, href }) => {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute(
        'href',
        href,
      )
    })
  })

  it('stacks on mobile and sits in one row from md', () => {
    const { container } = render(<Footer />)

    const row = container.querySelector('.container > div')
    expect(row).toHaveClass(
      'grid',
      'grid-cols-2',
      'md:flex',
      'md:justify-between',
    )
  })

  it('uses the global container and no fixed heights or widths', () => {
    const { container } = render(<Footer />)

    expect(container.querySelector('.container')).toBeInTheDocument()

    const fixedSize = /^(?:[a-z-]+:)*(?:h|w|size)-(?:\d|\[)/
    const offenders = [...container.querySelectorAll('[class]')].flatMap(
      (element) =>
        [...element.classList].filter((name) => fixedSize.test(name)),
    )
    expect(offenders).toEqual([])
  })
})
