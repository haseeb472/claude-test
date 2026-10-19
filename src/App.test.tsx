import { render } from '@testing-library/react'
import App from './App'
import { mobileMenuItems, navItems } from './data/navigation'

const targetId = (href: string) => href.replace('#', '')

// Sections that are not built yet, so their links have nothing to scroll to.
const pendingTargets = ['pricing', 'faq']

describe('App navigation targets', () => {
  it('has a section for every built navigation link', () => {
    const { container } = render(<App />)

    navItems
      .map(({ href }) => targetId(href))
      .filter((id) => !pendingTargets.includes(id))
      .forEach((id) => {
        expect(container.querySelector(`#${id}`)).toBeInTheDocument()
      })
  })

  it('has a target for the logo link', () => {
    const { container } = render(<App />)

    expect(container.querySelector('#top')).toBeInTheDocument()
  })

  it('points the mobile menu links at the same targets as the desktop links', () => {
    const desktopTargets = navItems.map(({ href }) => href)

    mobileMenuItems
      .filter(({ label }) => label !== 'FAQ & Contact')
      .forEach(({ href }) => {
        expect(desktopTargets).toContain(href)
      })
  })

  it.todo('has a Pricing section for the #pricing link')
  it.todo('has an FAQ section for the #faq link')
})
