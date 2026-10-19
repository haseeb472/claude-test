import { render, screen } from '@testing-library/react'
import { Container } from './Container'

describe('Container', () => {
  it('renders its children', () => {
    render(<Container>Page content</Container>)

    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('uses the global container class for gutters and width', () => {
    render(<Container>Page content</Container>)

    expect(screen.getByText('Page content')).toHaveClass('container')
  })

  it('keeps extra classes and forwards other props', () => {
    render(
      <Container className="flex" data-testid="wrapper">
        Page content
      </Container>,
    )

    const wrapper = screen.getByTestId('wrapper')
    expect(wrapper).toHaveClass('container', 'flex')
  })
})
