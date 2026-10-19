import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import chevronRight from '../../assets/icons/chevron-right.svg'
import closeIcon from '../../assets/icons/close.svg'
import { loginLink, mobileMenuCta } from '../../data/navigation'
import type { NavItem } from '../../types/navigation'

interface MobileMenuProps {
  id: string
  items: NavItem[]
  onClose: () => void
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])'

// Full-screen navigation shown below `lg`. Escape handling lives in the Header.
export function MobileMenu({ id, items, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return

    const focusable =
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    if (!focusable?.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      onKeyDown={trapFocus}
      className="fixed inset-0 z-50 flex flex-col bg-white font-jakarta lg:hidden"
    >
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex items-center justify-between border-b border-transparent px-6 pb-5 pt-7">
          <a
            href="#top"
            onClick={onClose}
            className="font-sans text-logo font-bold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            ▰ FlowPilot
          </a>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="-mr-2 flex size-10 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
          >
            <img src={closeIcon} alt="" />
          </button>
        </div>

        <nav aria-label="Mobile" className="px-5 pt-3">
          <ul className="flex flex-col gap-1">
            {items.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl p-3.5 text-menu-item font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
                >
                  {label}
                  <img src={chevronRight} alt="" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-3 bg-white px-6 pb-9 pt-4">
        <a
          href={loginLink.href}
          onClick={onClose}
          className="flex justify-center rounded-xl border border-slate-200 px-4 py-3.5 text-menu-cta font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
        >
          {loginLink.label}
        </a>
        <a
          href={mobileMenuCta.href}
          onClick={onClose}
          className="flex justify-center rounded-xl bg-gradient-to-r from-vibrant to-indigo-600 px-4 py-3.5 text-menu-cta font-semibold text-white shadow-menu-cta hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {mobileMenuCta.label}
        </a>
      </div>
    </div>
  )
}
