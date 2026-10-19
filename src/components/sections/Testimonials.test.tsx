import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { testimonials, testimonialsContent } from '../../data/testimonials'
import { Testimonials } from './Testimonials'

const previousButton = () =>
  screen.getByRole('button', { name: testimonialsContent.previousLabel })
const nextButton = () =>
  screen.getByRole('button', { name: testimonialsContent.nextLabel })
const activeSlide = () => screen.getByRole('group', { name: /of 3$/ })

// Pretends the screen is below the `md` breakpoint (or not).
function mockMobile(isMobile: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: isMobile && query.includes('max-width'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

const slideArea = () =>
  screen.getByRole('group', { name: testimonialsContent.slidesLabel })

// React listens for the native pointer events, so plain mouse events with the
// pointer event names carry the coordinates it needs.
function drag(from: { x: number; y?: number }, to: { x: number; y?: number }) {
  const area = slideArea()
  fireEvent(
    area,
    new MouseEvent('pointerdown', {
      bubbles: true,
      clientX: from.x,
      clientY: from.y ?? 0,
    }),
  )
  fireEvent(
    area,
    new MouseEvent('pointermove', {
      bubbles: true,
      clientX: to.x,
      clientY: to.y ?? 0,
    }),
  )
  fireEvent(area, new MouseEvent('pointerup', { bubbles: true }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Testimonials', () => {
  it('renders the eyebrow, heading and subtitle', () => {
    render(<Testimonials />)

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: testimonialsContent.title,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(testimonialsContent.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(testimonialsContent.subtitle)).toBeInTheDocument()
  })

  it('has three testimonials, with only the first one available', () => {
    const { container } = render(<Testimonials />)

    expect(testimonials).toHaveLength(3)
    expect(
      container.querySelectorAll('[aria-roledescription="slide"]'),
    ).toHaveLength(3)

    const slide = activeSlide()
    expect(slide).toHaveAccessibleName('1 of 3')
    expect(within(slide).getByText(testimonials[0].name)).toBeInTheDocument()
    expect(within(slide).getByText(testimonials[0].role)).toBeInTheDocument()
  })

  it('disables the previous button on the first slide', () => {
    render(<Testimonials />)

    expect(previousButton()).toBeDisabled()
    expect(nextButton()).toBeEnabled()
  })

  it('goes forward and enables the previous button', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)

    await user.click(nextButton())

    expect(activeSlide()).toHaveAccessibleName('2 of 3')
    expect(
      within(activeSlide()).getByText(testimonials[1].name),
    ).toBeInTheDocument()
    expect(previousButton()).toBeEnabled()
    expect(nextButton()).toBeEnabled()
  })

  it('disables the next button on the last slide', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)

    await user.click(nextButton())
    await user.click(nextButton())

    expect(activeSlide()).toHaveAccessibleName('3 of 3')
    expect(
      within(activeSlide()).getByText(testimonials[2].name),
    ).toBeInTheDocument()
    expect(nextButton()).toBeDisabled()
    expect(previousButton()).toBeEnabled()
  })

  it('goes back to the previous slide', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)

    await user.click(nextButton())
    await user.click(previousButton())

    expect(activeSlide()).toHaveAccessibleName('1 of 3')
    expect(previousButton()).toBeDisabled()
  })

  it('does not move past either end', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)

    await user.click(previousButton())
    expect(activeSlide()).toHaveAccessibleName('1 of 3')

    await user.click(nextButton())
    await user.click(nextButton())
    await user.click(nextButton())
    expect(activeSlide()).toHaveAccessibleName('3 of 3')
  })

  it('marks the slides before and after the current one for the slide animation', async () => {
    const user = userEvent.setup()
    const { container } = render(<Testimonials />)

    const positions = () =>
      [...container.querySelectorAll('.testimonial-slide')].map((slide) =>
        slide.getAttribute('data-position'),
      )

    expect(positions()).toEqual(['active', 'after', 'after'])

    await user.click(nextButton())
    expect(positions()).toEqual(['before', 'active', 'after'])

    await user.click(nextButton())
    expect(positions()).toEqual(['before', 'before', 'active'])
  })

  it('hides inactive slides from assistive technology and the keyboard', () => {
    const { container } = render(<Testimonials />)

    const inactive = container.querySelectorAll(
      '.testimonial-slide[data-position]:not([data-position="active"])',
    )
    expect(inactive).toHaveLength(2)
    inactive.forEach((slide) => {
      expect(slide).toHaveAttribute('aria-hidden', 'true')
      expect(slide).toHaveAttribute('inert')
    })
  })

  it('stacks the slides so the card grows with the longest testimonial', () => {
    const { container } = render(<Testimonials />)

    container.querySelectorAll('.testimonial-slide').forEach((slide) => {
      expect(slide).toHaveClass('col-start-1', 'row-start-1')
    })
  })

  it('sizes everything from content and padding, with no fixed heights or widths', () => {
    const { container } = render(<Testimonials />)

    const fixedSize = /^(?:[a-z-]+:)*(?:h|w|size)-(?:\d|\[)/
    const offenders = [...container.querySelectorAll('[class]')].flatMap(
      (element) =>
        [...element.classList].filter((name) => fixedSize.test(name)),
    )

    expect(offenders).toEqual([])
  })

  it('hides both buttons below the md breakpoint and shows them from md up', () => {
    render(<Testimonials />)

    ;[previousButton(), nextButton()].forEach((button) => {
      expect(button).toHaveClass('hidden', 'md:inline-flex')
    })
  })

  describe('dragging on mobile', () => {
    it('goes to the next slide when dragged left', () => {
      mockMobile(true)
      render(<Testimonials />)

      drag({ x: 300 }, { x: 200 })

      expect(activeSlide()).toHaveAccessibleName('2 of 3')
    })

    it('goes to the previous slide when dragged right', () => {
      mockMobile(true)
      render(<Testimonials />)

      drag({ x: 300 }, { x: 200 })
      drag({ x: 100 }, { x: 220 })

      expect(activeSlide()).toHaveAccessibleName('1 of 3')
    })

    it('only moves one slide per drag, however far it goes', () => {
      mockMobile(true)
      render(<Testimonials />)

      const area = slideArea()
      fireEvent(
        area,
        new MouseEvent('pointerdown', { bubbles: true, clientX: 300 }),
      )
      fireEvent(
        area,
        new MouseEvent('pointermove', { bubbles: true, clientX: 240 }),
      )
      fireEvent(
        area,
        new MouseEvent('pointermove', { bubbles: true, clientX: 100 }),
      )

      expect(activeSlide()).toHaveAccessibleName('2 of 3')
    })

    it('does not move past the first or last slide', () => {
      mockMobile(true)
      render(<Testimonials />)

      drag({ x: 100 }, { x: 250 })
      expect(activeSlide()).toHaveAccessibleName('1 of 3')

      drag({ x: 300 }, { x: 100 })
      drag({ x: 300 }, { x: 100 })
      drag({ x: 300 }, { x: 100 })
      expect(activeSlide()).toHaveAccessibleName('3 of 3')
    })

    it('ignores short drags', () => {
      mockMobile(true)
      render(<Testimonials />)

      drag({ x: 300 }, { x: 270 })

      expect(activeSlide()).toHaveAccessibleName('1 of 3')
    })

    it('ignores mostly vertical drags so the page can still scroll', () => {
      mockMobile(true)
      render(<Testimonials />)

      drag({ x: 300, y: 100 }, { x: 250, y: 300 })

      expect(activeSlide()).toHaveAccessibleName('1 of 3')
    })

    it('ignores a drag that was cancelled', () => {
      mockMobile(true)
      render(<Testimonials />)

      const area = slideArea()
      fireEvent(
        area,
        new MouseEvent('pointerdown', { bubbles: true, clientX: 300 }),
      )
      fireEvent(area, new MouseEvent('pointercancel', { bubbles: true }))
      fireEvent(
        area,
        new MouseEvent('pointermove', { bubbles: true, clientX: 100 }),
      )

      expect(activeSlide()).toHaveAccessibleName('1 of 3')
    })

    it('does not respond to dragging on larger screens', () => {
      mockMobile(false)
      render(<Testimonials />)

      drag({ x: 300 }, { x: 100 })

      expect(activeSlide()).toHaveAccessibleName('1 of 3')
    })

    it('stops the browser from taking over horizontal drags', () => {
      render(<Testimonials />)

      expect(slideArea()).toHaveClass('touch-pan-y')
    })
  })

  describe('keyboard', () => {
    it('changes slides with the arrow keys, within the limits', () => {
      render(<Testimonials />)

      const area = slideArea()
      expect(area).toHaveAttribute('tabindex', '0')

      fireEvent.keyDown(area, { key: 'ArrowLeft' })
      expect(activeSlide()).toHaveAccessibleName('1 of 3')

      fireEvent.keyDown(area, { key: 'ArrowRight' })
      expect(activeSlide()).toHaveAccessibleName('2 of 3')

      fireEvent.keyDown(area, { key: 'ArrowRight' })
      fireEvent.keyDown(area, { key: 'ArrowRight' })
      expect(activeSlide()).toHaveAccessibleName('3 of 3')

      fireEvent.keyDown(area, { key: 'ArrowLeft' })
      expect(activeSlide()).toHaveAccessibleName('2 of 3')
    })
  })

  it('uses the global container', () => {
    const { container } = render(<Testimonials />)

    expect(container.querySelector('.container')).toBeInTheDocument()
  })

  it('is the target of the Testimonials navigation link', () => {
    const { container } = render(<Testimonials />)

    expect(container.querySelector('#testimonials')).toBeInTheDocument()
  })
})
