import type { NavItem } from '../types/navigation'

export const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

export const loginLink: NavItem = { label: 'Log In', href: '#login' }

export const ctaLink: NavItem = { label: 'Get Started', href: '#contact' }

// The mobile menu design merges FAQ and Contact and uses its own CTA label.
export const mobileMenuItems: NavItem[] = [
  ...navItems.slice(0, -1),
  { label: 'FAQ & Contact', href: '#faq' },
]

export const mobileMenuCta: NavItem = { label: 'Start Free', href: '#contact' }
