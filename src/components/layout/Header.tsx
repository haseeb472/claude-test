import { useCallback, useEffect, useRef, useState } from 'react'
import menuIcon from '../../assets/icons/menu.svg'
import {
  ctaLink,
  loginLink,
  mobileMenuItems,
  navItems,
} from '../../data/navigation'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { MobileMenu } from './MobileMenu'

const MOBILE_MENU_ID = 'mobile-menu'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeMenu])

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-hairline bg-white lg:h-19">
      <Container className="flex h-full items-center justify-between">
        <a
          href="#top"
          className="text-logo font-bold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        >
          ▰ FlowPilot
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-nav font-medium text-muted transition-colors hover:text-ink"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href={loginLink.href} className="text-nav font-semibold text-ink">
            {loginLink.label}
          </a>
          <ButtonLink href={ctaLink.href} className="w-37.5">
            {ctaLink.label}
          </ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls={MOBILE_MENU_ID}
          onClick={() => setIsOpen(true)}
          className="-mr-2 p-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue lg:hidden"
        >
          <img src={menuIcon} alt="" />
        </button>
      </Container>

      {isOpen && (
        <MobileMenu
          id={MOBILE_MENU_ID}
          items={mobileMenuItems}
          onClose={closeMenu}
        />
      )}
    </header>
  )
}
