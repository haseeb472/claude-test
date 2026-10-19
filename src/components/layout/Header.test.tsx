import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mobileMenuCta, mobileMenuItems, navItems } from '../../data/navigation'
import { Header } from './Header'

const queryMenu = () => screen.queryByRole('dialog', { name: /mobile/i })

async function openMenu() {
  const user = userEvent.setup()
  render(<Header />)
  await user.click(screen.getByRole('button', { name: 'Open menu' }))
  return user
}

describe('Header', () => {
  it('renders the logo, primary navigation and actions', () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: /flowpilot/i })).toBeInTheDocument()

    const primary = screen.getByRole('navigation', { name: 'Primary' })
    navItems.forEach(({ label, href }) => {
      expect(
        within(primary).getByRole('link', { name: label }),
      ).toHaveAttribute('href', href)
    })

    expect(screen.getByRole('link', { name: 'Log In' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Get Started' }),
    ).toBeInTheDocument()
  })

  it('keeps the mobile menu closed by default', () => {
    render(<Header />)

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(queryMenu()).not.toBeInTheDocument()
  })

  it('opens the full-screen menu with every link and both actions', async () => {
    await openMenu()

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    const menu = screen.getByRole('dialog', { name: /mobile/i })
    const nav = within(menu).getByRole('navigation', { name: 'Mobile' })
    mobileMenuItems.forEach(({ label, href }) => {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute(
        'href',
        href,
      )
    })

    expect(
      within(menu).getByRole('link', { name: 'Log In' }),
    ).toBeInTheDocument()
    expect(
      within(menu).getByRole('link', { name: mobileMenuCta.label }),
    ).toHaveAttribute('href', mobileMenuCta.href)
  })

  it('moves focus to the close button when the menu opens', async () => {
    await openMenu()

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus()
  })

  it('closes with the close button and returns focus to the toggle', async () => {
    const user = await openMenu()

    await user.click(screen.getByRole('button', { name: 'Close menu' }))

    expect(queryMenu()).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  it('closes on Escape and returns focus to the toggle', async () => {
    const user = await openMenu()

    await user.keyboard('{Escape}')

    expect(queryMenu()).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  it('closes after choosing a link', async () => {
    const user = await openMenu()

    const menu = screen.getByRole('dialog', { name: /mobile/i })
    await user.click(within(menu).getByRole('link', { name: 'Pricing' }))

    expect(queryMenu()).not.toBeInTheDocument()
  })

  it('keeps keyboard focus inside the open menu', async () => {
    const user = await openMenu()

    const menu = screen.getByRole('dialog', { name: /mobile/i })
    const focusable = within(menu).getAllByRole('link')
    const lastLink = focusable[focusable.length - 1]

    lastLink.focus()
    await user.tab()

    expect(within(menu).getAllByRole('link')[0]).toHaveFocus()
  })

  it('locks page scroll while the menu is open', async () => {
    const user = await openMenu()
    expect(document.body.style.overflow).toBe('hidden')

    await user.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(document.body.style.overflow).toBe('')
  })
})
