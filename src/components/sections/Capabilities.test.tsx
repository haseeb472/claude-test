import { render, screen, within } from '@testing-library/react'
import { features, featuresContent } from '../../data/features'
import { Capabilities } from './Capabilities'

describe('Capabilities', () => {
  it('renders the heading and labels the section with it', () => {
    render(<Capabilities />)

    expect(
      screen.getByRole('heading', { level: 2, name: featuresContent.title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: featuresContent.title }),
    ).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Capabilities />)

    expect(screen.getByText(featuresContent.subtitle)).toBeInTheDocument()
  })

  it('renders one card for every feature', () => {
    render(<Capabilities />)

    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(features.length)

    features.forEach(({ title }) => {
      expect(
        screen.getByRole('heading', { level: 3, name: title }),
      ).toBeInTheDocument()
    })
  })

  it('is the target of the Features navigation link', () => {
    const { container } = render(<Capabilities />)

    expect(container.querySelector('#features')).toBeInTheDocument()
  })
})
