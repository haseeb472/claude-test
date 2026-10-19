import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  billingOptions,
  defaultPlanId,
  pricingContent,
  pricingPlans,
} from '../../data/pricing'
import type { BillingPeriod } from '../../types/pricing'
import { Pricing } from './Pricing'

const [starter, pro, business] = pricingPlans

const getRadio = (name: string) => screen.getByRole('radio', { name })
const getCard = (name: string) => getRadio(name).closest('label') as HTMLElement
// The monthly and yearly prices of a plan are stacked in that order.
const priceFor = (plan: (typeof pricingPlans)[number], period: BillingPeriod) =>
  getCard(plan.name).querySelectorAll('.tab-panel')[
    billingOptions.findIndex((option) => option.id === period)
  ] as HTMLElement

describe('Pricing', () => {
  it('renders the heading and subtitle', () => {
    render(<Pricing />)

    expect(
      screen.getByRole('heading', { level: 2, name: pricingContent.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(pricingContent.subtitle)).toBeInTheDocument()
  })

  it('renders the three plans with their details', () => {
    render(<Pricing />)

    expect(screen.getAllByRole('radio')).toHaveLength(pricingPlans.length)
    pricingPlans.forEach((plan) => {
      const card = getCard(plan.name)

      expect(
        within(card).getByRole('heading', { level: 3, name: plan.name }),
      ).toBeInTheDocument()
      expect(within(card).getByText(plan.description)).toBeInTheDocument()
      plan.features.forEach((feature) => {
        expect(within(card).getByText(feature)).toBeInTheDocument()
      })
      expect(
        within(card).getByRole('link', { name: pricingContent.cta.label }),
      ).toHaveAttribute('href', pricingContent.cta.href)
    })
  })

  describe('billing period', () => {
    it('starts on Monthly with the monthly prices showing', () => {
      render(<Pricing />)

      expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      expect(screen.getByRole('button', { name: 'Yearly' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )

      pricingPlans.forEach((plan) => {
        expect(priceFor(plan, 'monthly')).toHaveAttribute('data-active', 'true')
        expect(priceFor(plan, 'yearly')).toHaveAttribute('data-active', 'false')
      })
    })

    it('switches every plan to its yearly price and back', async () => {
      const user = userEvent.setup()
      render(<Pricing />)

      await user.click(screen.getByRole('button', { name: 'Yearly' }))

      expect(screen.getByRole('button', { name: 'Yearly' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
      pricingPlans.forEach((plan) => {
        expect(priceFor(plan, 'yearly')).toHaveAttribute('data-active', 'true')
        expect(priceFor(plan, 'monthly')).toHaveAttribute(
          'data-active',
          'false',
        )
        expect(priceFor(plan, 'yearly')).toHaveTextContent(
          plan.prices.yearly.unit,
        )
      })

      await user.click(screen.getByRole('button', { name: 'Monthly' }))
      expect(priceFor(pro, 'monthly')).toHaveAttribute('data-active', 'true')
    })

    it('hides the price that is not showing from assistive technology', async () => {
      const user = userEvent.setup()
      render(<Pricing />)

      expect(priceFor(pro, 'yearly')).toHaveAttribute('aria-hidden', 'true')
      await user.click(screen.getByRole('button', { name: 'Yearly' }))
      expect(priceFor(pro, 'monthly')).toHaveAttribute('aria-hidden', 'true')
      expect(priceFor(pro, 'yearly')).toHaveAttribute('aria-hidden', 'false')
    })

    it('stacks the prices so switching cannot shift the layout', () => {
      const { container } = render(<Pricing />)

      container.querySelectorAll('.tab-panel').forEach((price) => {
        expect(price).toHaveClass('col-start-1', 'row-start-1')
      })
      expect(billingOptions).toHaveLength(2)
    })
  })

  describe('selecting a plan', () => {
    const activeCards = (container: HTMLElement) => [
      ...container.querySelectorAll('label[data-active="true"]'),
    ]

    it('starts with the Pro plan selected', () => {
      const { container } = render(<Pricing />)

      expect(defaultPlanId).toBe(pro.id)
      expect(getRadio(pro.name)).toBeChecked()
      expect(getRadio(starter.name)).not.toBeChecked()
      expect(getRadio(business.name)).not.toBeChecked()
      expect(activeCards(container)).toEqual([getCard(pro.name)])
    })

    it.each([starter, business])(
      'selects the $name plan and deselects the others',
      async (plan) => {
        const user = userEvent.setup()
        const { container } = render(<Pricing />)

        await user.click(within(getCard(plan.name)).getByText(plan.name))

        expect(getRadio(plan.name)).toBeChecked()
        expect(getRadio(pro.name)).not.toBeChecked()
        expect(activeCards(container)).toEqual([getCard(plan.name)])
      },
    )

    it('keeps exactly one card active however many times it changes', async () => {
      const user = userEvent.setup()
      const { container } = render(<Pricing />)

      for (const plan of [starter, business, pro, starter, pro, business]) {
        await user.click(getCard(plan.name))
        expect(activeCards(container)).toHaveLength(1)
        expect(getRadio(plan.name)).toBeChecked()
      }
    })

    it('selects a plan when its Get Started link is clicked', async () => {
      const user = userEvent.setup()
      render(<Pricing />)

      await user.click(
        within(getCard(starter.name)).getByRole('link', {
          name: pricingContent.cta.label,
        }),
      )

      expect(getRadio(starter.name)).toBeChecked()
    })

    it('moves the selection with the arrow keys', async () => {
      const user = userEvent.setup()
      render(<Pricing />)

      getRadio(pro.name).focus()
      await user.keyboard('{ArrowRight}')
      expect(getRadio(business.name)).toBeChecked()

      await user.keyboard('{ArrowLeft}')
      expect(getRadio(pro.name)).toBeChecked()
    })

    it('keeps the selection when the billing period changes', async () => {
      const user = userEvent.setup()
      render(<Pricing />)

      await user.click(getCard(business.name))
      await user.click(screen.getByRole('button', { name: 'Yearly' }))

      expect(getRadio(business.name)).toBeChecked()
    })

    it('shows the Most Popular banner only while Pro is selected', async () => {
      const user = userEvent.setup()
      render(<Pricing />)

      const badge = screen.getByText(pro.badge as string)
      expect(badge).not.toHaveClass('opacity-0')

      await user.click(getCard(starter.name))
      expect(badge).toHaveClass('opacity-0')

      await user.click(getCard(pro.name))
      expect(badge).not.toHaveClass('opacity-0')
    })

    it('describes each plan with its price and description', () => {
      render(<Pricing />)

      expect(getRadio(pro.name)).toHaveAccessibleDescription(
        expect.stringContaining(pro.description),
      )
      expect(getRadio(pro.name)).toHaveAccessibleDescription(
        expect.stringContaining(pro.prices.monthly.amount),
      )
    })

    it('scrolls the chosen card into view in the mobile row', async () => {
      const user = userEvent.setup()
      render(<Pricing />)

      const scroller = screen.getByRole('radiogroup')
      const scrollTo = vi.fn()
      scroller.scrollTo = scrollTo

      await user.click(getCard(business.name))

      expect(scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'smooth' }),
      )
    })

    it('puts the featured plan first in the mobile row', () => {
      render(<Pricing />)

      expect(getCard(pro.name)).toHaveClass('order-first', 'md:order-none')
      expect(getCard(starter.name)).not.toHaveClass('order-first')
    })
  })

  it('sizes everything from content and padding, with no fixed heights or widths', () => {
    const { container } = render(<Pricing />)

    const fixedSize = /^(?:[a-z-]+:)*(?:h|w|size)-(?:\d|\[)/
    const offenders = [...container.querySelectorAll('[class]')].flatMap(
      (element) =>
        [...element.classList].filter((name) => fixedSize.test(name)),
    )

    expect(offenders).toEqual([])
  })

  it('uses the global container and is the target of the Pricing link', () => {
    const { container } = render(<Pricing />)

    expect(container.querySelector('.container')).toBeInTheDocument()
    expect(container.querySelector('#pricing')).toBeInTheDocument()
  })
})
