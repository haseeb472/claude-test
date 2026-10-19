export type BillingPeriod = 'monthly' | 'yearly'

export interface BillingOption {
  id: BillingPeriod
  label: string
}

export interface PlanPrice {
  amount: string
  unit: string
}

// Spacing of the feature list on desktop. The design spaces each card differently.
export type FeatureDensity = 'relaxed' | 'regular' | 'tight'

export interface PricingPlan {
  id: string
  name: string
  description: string
  prices: Record<BillingPeriod, PlanPrice>
  features: string[]
  density: FeatureDensity
  badge?: string
}
