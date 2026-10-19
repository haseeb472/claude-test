import { footerContent, footerLinks } from '../../data/footer'
import { Container } from '../ui/Container'
import { ResponsiveText } from '../ui/ResponsiveText'

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-white pb-6 pt-6 md:pb-12 md:pt-12">
      <Container>
        {/* Mobile: logo and copyright on one row, links below. Desktop: one row. */}
        <div className="grid grid-cols-2 items-center gap-y-6.5 md:flex md:justify-between">
          <a
            href="#top"
            className="text-nav font-bold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            ▰ FlowPilot
          </a>

          <p className="justify-self-end text-caption text-muted md:text-nav">
            <ResponsiveText
              full={footerContent.copyright}
              short={footerContent.shortCopyright}
            />
          </p>

          <nav
            aria-label={footerContent.navLabel}
            className="col-span-2 md:col-span-1"
          >
            <ul className="grid grid-cols-3 gap-x-6 md:flex">
              {footerLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block text-nav text-muted transition-colors duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
