import config from '../../tailwind.config'

// `shadow-x` and `text-x` also accept colours. If a colour has the same name as
// a shadow or a font size, Tailwind applies both and the result is wrong (a
// `shadow-card` shadow once came out near-white because `card` is a colour).
describe('tailwind.config', () => {
  const extend = config.theme.extend
  const colorNames = Object.keys(extend.colors)

  it('has no shadow named like a colour', () => {
    const clashes = Object.keys(extend.boxShadow).filter((name) =>
      colorNames.includes(name),
    )

    expect(clashes).toEqual([])
  })

  it('has no font size named like a colour', () => {
    const clashes = Object.keys(extend.fontSize).filter((name) =>
      colorNames.includes(name),
    )

    expect(clashes).toEqual([])
  })
})
