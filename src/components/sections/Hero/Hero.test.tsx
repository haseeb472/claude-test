import { render, screen, within } from '@testing-library/react'
import { heroChecks, heroContent, mockupTasks } from '../../../data/hero'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the headline and subtitle', () => {
    render(<Hero />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(heroContent.title.first)
    expect(heading).toHaveTextContent(heroContent.title.second)
    expect(heading).toHaveTextContent(heroContent.title.third)
    expect(screen.getByText(heroContent.subtitle)).toBeInTheDocument()
  })

  it('labels the section with the headline', () => {
    render(<Hero />)

    expect(
      screen.getByRole('region', { name: /work smarter/i }),
    ).toBeInTheDocument()
  })

  it('renders the announcement badge', () => {
    render(<Hero />)

    expect(screen.getByText(heroContent.badge.tag)).toBeInTheDocument()
    expect(screen.getByText(heroContent.badge.text)).toBeInTheDocument()
  })

  it('renders both calls to action as links', () => {
    render(<Hero />)

    expect(screen.getByRole('link', { name: 'Start Free' })).toHaveAttribute(
      'href',
      heroContent.primaryCta.href,
    )
    expect(
      screen.getByRole('link', { name: 'See How It Works' }),
    ).toHaveAttribute('href', heroContent.secondaryCta.href)
  })

  it('lists every reassurance check', () => {
    render(<Hero />)

    const items = screen.getAllByRole('listitem')
    heroChecks.forEach(({ label }) => {
      expect(items.some((item) => item.textContent === label)).toBe(true)
    })
  })

  it('hides the decorative dashboard preview from assistive technology', () => {
    render(<Hero />)

    const preview = screen
      .getByText('Good morning, Sarah!')
      .closest('[aria-hidden="true"]')
    expect(preview).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /good morning/i }),
    ).not.toBeInTheDocument()
  })

  it('shows every task with its status in the dashboard preview', () => {
    render(<Hero />)

    const preview = screen
      .getByText('Good morning, Sarah!')
      .closest('[aria-hidden="true"]') as HTMLElement

    mockupTasks.forEach(({ title, status }) => {
      expect(within(preview).getAllByText(title).length).toBeGreaterThan(0)
      expect(within(preview).getAllByText(status).length).toBeGreaterThan(0)
    })
  })
})
