import fs from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import config from '../../tailwind.config'

// A numbered utility such as `py-2.25` only works if that number is in the
// spacing scale. When it is not, Tailwind skips it without any error and the
// element silently loses its padding, size or position. This test finds those.
const NUMBERED_UTILITY =
  /^(?:[a-z-]+:)*!?-?(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|size|w|h|min-w|min-h|max-w|max-h|top|right|bottom|left|inset|inset-x|inset-y|scroll-p|scroll-px|scroll-py|scroll-pl|scroll-pr|scroll-pt|scroll-pb|basis)-\d+(?:\.\d+)?$/

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(fullPath)
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [fullPath]
      : []
  })
}

const escapeSelector = (name: string) => name.replace(/[^a-zA-Z0-9_-]/g, '\\$&')

describe('tailwind classes in the source', () => {
  it('only use numbers that exist in the Tailwind scale', async () => {
    const used = new Set<string>()
    for (const file of sourceFiles(path.resolve(__dirname, '..'))) {
      const text = fs.readFileSync(file, 'utf8')
      text
        .split(/[\s"'`{}(),]+/)
        .filter((token) => NUMBERED_UTILITY.test(token))
        .forEach((token) => used.add(token))
    }

    expect(used.size).toBeGreaterThan(50)

    const result = await postcss([
      tailwindcss({ ...config, content: [{ raw: [...used].join(' ') }] }),
    ]).process('@tailwind utilities;', { from: undefined })

    const missing = [...used].filter(
      (token) => !result.css.includes(`.${escapeSelector(token)}`),
    )

    expect(missing).toEqual([])
  })
})
