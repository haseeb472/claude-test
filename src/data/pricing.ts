import type { BillingOption, PricingPlan } from '../types/pricing'

export const pricingContent = {
  title: 'Simple, transparent pricing',
  subtitle: 'Choose the plan that works best for your team.',
  billingLabel: 'Billing period',
  plansLabel: 'Pricing plans',
  cta: { label: 'Get Started', href: '#contact' },
}

export const billingOptions: BillingOption[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
]

// The plan selected when the page loads.
export const defaultPlanId = 'pro'

// The Figma file only has monthly prices. The yearly prices are placeholders
// (ten months for twelve) written in the same shape.
export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For individuals getting started',
    prices: {
      monthly: { amount: '$0', unit: '/month' },
      yearly: { amount: '$0', unit: '/year' },
    },
    features: ['Up to 3 projects', 'Basic AI suggestions', 'Community support'],
    density: 'relaxed',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams',
    prices: {
      monthly: { amount: '$19', unit: '/month' },
      yearly: { amount: '$190', unit: '/year' },
    },
    features: [
      'Unlimited projects',
      'Advanced AI suggestions',
      'Team collaboration',
      'Priority support',
    ],
    density: 'regular',
    badge: 'Most Popular',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For larger organizations',
    prices: {
      monthly: { amount: '$49', unit: '/month' },
      yearly: { amount: '$490', unit: '/year' },
    },
    features: [
      'Everything in Pro',
      'Advanced automations',
      'Custom integrations',
      'Dedicated support',
    ],
    density: 'tight',
  },
]
