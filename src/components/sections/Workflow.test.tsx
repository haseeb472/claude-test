import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { workflowContent, workflowTabs } from '../../data/workflow'
import { Workflow } from './Workflow'

const [plan, automate, collaborate] = workflowTabs

const getTab = (label: string) => screen.getByRole('tab', { name: label })

describe('Workflow', () => {
  it('renders the heading and subtitle', () => {
    render(<Workflow />)

    expect(
      screen.getByRole('heading', { level: 2, name: workflowContent.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(workflowContent.subtitle)).toBeInTheDocument()
  })

  it('renders every tab with the first one selected', () => {
    render(<Workflow />)

    expect(screen.getAllByRole('tab')).toHaveLength(workflowTabs.length)
    expect(getTab(plan.label)).toHaveAttribute('aria-selected', 'true')
    expect(getTab(automate.label)).toHaveAttribute('aria-selected', 'false')
    expect(getTab(collaborate.label)).toHaveAttribute('aria-selected', 'false')
  })

  it('shows only the selected tab content to assistive technology', () => {
    render(<Workflow />)

    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveAccessibleName(plan.label)
    expect(
      within(panel).getByRole('heading', { level: 3, name: plan.title }),
    ).toBeInTheDocument()
    expect(within(panel).getByText(plan.description)).toBeInTheDocument()
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(
      workflowTabs.length,
    )
  })

  it('shows the statistic of the selected tab', () => {
    render(<Workflow />)

    const group = screen.getByRole('group', { name: plan.label })
    expect(within(group).getByText(plan.stat.value)).toBeInTheDocument()
    expect(within(group).getByText(plan.stat.label)).toBeInTheDocument()
  })

  it.each([automate, collaborate])(
    'switches to the $label tab and updates all its content',
    async (tab) => {
      const user = userEvent.setup()
      render(<Workflow />)

      await user.click(getTab(tab.label))

      expect(getTab(tab.label)).toHaveAttribute('aria-selected', 'true')
      expect(getTab(plan.label)).toHaveAttribute('aria-selected', 'false')

      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAccessibleName(tab.label)
      expect(
        within(panel).getByRole('heading', { level: 3, name: tab.title }),
      ).toBeInTheDocument()
      expect(within(panel).getByText(tab.description)).toBeInTheDocument()

      const group = screen.getByRole('group', { name: tab.label })
      expect(within(group).getByText(tab.stat.value)).toBeInTheDocument()
      expect(within(group).getByText(tab.stat.label)).toBeInTheDocument()
    },
  )

  it('marks only the selected panels as active for the fade animation', async () => {
    const user = userEvent.setup()
    const { container } = render(<Workflow />)

    await user.click(getTab(automate.label))

    const active = container.querySelectorAll('[data-active="true"]')
    const inactive = container.querySelectorAll('[data-active="false"]')
    // One left panel and one statistic panel per tab.
    expect(active).toHaveLength(2)
    expect(inactive).toHaveLength((workflowTabs.length - 1) * 2)
    inactive.forEach((panel) => expect(panel).toHaveAttribute('inert'))
  })

  it('keeps the panels stacked so switching tabs cannot shift the layout', () => {
    const { container } = render(<Workflow />)

    const panels = container.querySelectorAll('.tab-panel')
    expect(panels).toHaveLength(workflowTabs.length * 2)
    panels.forEach((panel) =>
      expect(panel).toHaveClass('col-start-1', 'row-start-1'),
    )
  })

  it('only the selected tab is reachable with the Tab key', async () => {
    const user = userEvent.setup()
    render(<Workflow />)

    expect(getTab(plan.label)).toHaveAttribute('tabindex', '0')
    expect(getTab(automate.label)).toHaveAttribute('tabindex', '-1')

    await user.click(getTab(automate.label))

    expect(getTab(automate.label)).toHaveAttribute('tabindex', '0')
    expect(getTab(plan.label)).toHaveAttribute('tabindex', '-1')
  })

  it('moves between tabs with the arrow, Home and End keys', async () => {
    const user = userEvent.setup()
    render(<Workflow />)

    getTab(plan.label).focus()

    await user.keyboard('{ArrowRight}')
    expect(getTab(automate.label)).toHaveAttribute('aria-selected', 'true')
    expect(getTab(automate.label)).toHaveFocus()

    await user.keyboard('{End}')
    expect(getTab(collaborate.label)).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}')
    expect(getTab(plan.label)).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(getTab(collaborate.label)).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Home}')
    expect(getTab(plan.label)).toHaveAttribute('aria-selected', 'true')
    expect(getTab(plan.label)).toHaveFocus()
  })

  it('handles rapid tab switching and ends on the last tab clicked', async () => {
    const user = userEvent.setup()
    render(<Workflow />)

    await user.click(getTab(automate.label))
    await user.click(getTab(collaborate.label))
    await user.click(getTab(plan.label))
    await user.click(getTab(collaborate.label))

    expect(getTab(collaborate.label)).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName(collaborate.label)
  })

  it('sizes boxes from content and padding, with no fixed heights or widths', () => {
    const { container } = render(<Workflow />)

    const fixedSize = /^(?:[a-z-]+:)*(?:h|w|size)-(?:\d|\[)/
    const offenders = [...container.querySelectorAll('[class]')].flatMap(
      (element) =>
        [...element.classList].filter((name) => fixedSize.test(name)),
    )

    expect(offenders).toEqual([])
  })

  it('lets the cards and the progress bar fill the banner below 1200px', () => {
    const { container } = render(<Workflow />)

    const leftCard = screen.getByRole('tabpanel').parentElement as HTMLElement
    const statCard = screen.getByRole('group', { name: plan.label })
      .parentElement as HTMLElement
    const track = container.querySelector('.tab-bar-fill')
      ?.parentElement as HTMLElement

    // The width caps only apply to the two-column layout from `wide`.
    expect(leftCard).toHaveClass('wide:max-w-tab-card')
    expect(statCard).toHaveClass('wide:max-w-stat-card')
    expect(track).toHaveClass('wide:max-w-bar')

    const capsBelowWide = [leftCard, statCard, track].flatMap((element) =>
      [...element.classList].filter((name) =>
        /^(?:md:|lg:)?max-w-(?:tab-card|stat-card|bar)$/.test(name),
      ),
    )
    expect(capsBelowWide).toEqual([])
  })

  it('makes all tabs the same width by letting the widest label decide', () => {
    render(<Workflow />)

    const tablist = screen.getByRole('tablist')
    expect(tablist).toHaveClass('grid', 'auto-cols-fr', 'grid-flow-col')
  })

  it('spreads the mobile tab row scroll across the tabs', async () => {
    const user = userEvent.setup()
    render(<Workflow />)

    const scroller = screen.getByRole('tablist').parentElement as HTMLElement
    Object.defineProperty(scroller, 'scrollWidth', { value: 400 })
    Object.defineProperty(scroller, 'clientWidth', { value: 340 })
    const scrollTo = vi.fn()
    scroller.scrollTo = scrollTo

    await user.click(getTab(collaborate.label))
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 60, behavior: 'smooth' })

    await user.click(getTab(automate.label))
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 30, behavior: 'smooth' })

    await user.click(getTab(plan.label))
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'smooth' })
  })

  it('is the target of the How It Works navigation link', () => {
    const { container } = render(<Workflow />)

    expect(container.querySelector('#how-it-works')).toBeInTheDocument()
  })
})
