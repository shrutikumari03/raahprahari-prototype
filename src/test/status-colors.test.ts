import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LEVEL_META } from '@/components/advisory'

/**
 * The four road statuses must each have their own readable colour in both
 * themes, so no two can be confused, and none may rely on colour alone.
 */
const styles = readFileSync(join(process.cwd(), 'src', 'styles.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
)

/** Declarations of the first block whose selector line is exactly `selector {`. */
function tokens(selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const head = new RegExp(`(^|\\n)${escaped}(?:,\\s*\\.photo-surface)?\\s*\\{`)
  const found = head.exec(styles)
  if (!found) throw new Error(`no ${selector} block`)
  const body = styles.slice(found.index, styles.indexOf('\n}', found.index))
  const out: Record<string, string> = {}
  for (const m of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim()
  return out
}

const light = tokens(':root')
const dark = { ...light, ...tokens('.dark') }
const THEMES = { light, dark }

function resolve(theme: Record<string, string>, name: string): string {
  let value = theme[name]
  for (let i = 0; i < 6 && value?.startsWith('var('); i += 1) value = theme[value.slice(4, -1)]
  if (!/^#[0-9a-f]{6}$/i.test(value ?? '')) throw new Error(`${name} is not a hex colour: ${value}`)
  return value.toLowerCase()
}

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const linear = (c: number) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
function luminance(hex: string) {
  const [r, g, b] = channels(hex).map(linear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
/** CIE76 colour difference; above ~10 two colours read as clearly different. */
function deltaE(a: string, b: string) {
  const lab = (hex: string) => {
    const [r, g, b2] = channels(hex).map(linear)
    const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
    const x = f((r * 0.4124 + g * 0.3576 + b2 * 0.1805) / 0.95047)
    const y = f(r * 0.2126 + g * 0.7152 + b2 * 0.0722)
    const z = f((r * 0.0193 + g * 0.1192 + b2 * 0.9505) / 1.08883)
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
  }
  const [p, q] = [lab(a), lab(b)]
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
}

const STATUSES = ['--status-clear', '--status-caution', '--status-avoid', '--status-dnt'] as const
const SURFACES = ['--background', '--card', '--muted'] as const

describe.each(Object.entries(THEMES))('road status colours (%s theme)', (_name, theme) => {
  it('gives every status a colour readable as text on every surface (4.5:1)', () => {
    for (const status of STATUSES)
      for (const surface of SURFACES)
        expect(
          contrast(resolve(theme, status), resolve(theme, surface)),
          `${status} on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps all four statuses clearly different from each other', () => {
    for (let i = 0; i < STATUSES.length; i += 1)
      for (let j = i + 1; j < STATUSES.length; j += 1)
        expect(
          deltaE(resolve(theme, STATUSES[i]), resolve(theme, STATUSES[j])),
          `${STATUSES[i]} vs ${STATUSES[j]}`,
        ).toBeGreaterThan(20)
  })

  it('does not reuse the link or primary colour for Clear', () => {
    const clear = resolve(theme, '--status-clear')
    expect(clear).not.toBe(resolve(theme, '--link'))
    expect(clear).not.toBe(resolve(theme, '--primary'))
  })

  it('treats an official closure as Do not travel', () => {
    expect(resolve(theme, '--status-closed')).toBe(resolve(theme, '--status-dnt'))
  })
})

describe('road status badges never rely on colour alone', () => {
  it('pairs each level with its own icon', () => {
    const icons = (['clear', 'caution', 'avoid', 'do_not_travel', 'unknown'] as const).map(
      (level) => LEVEL_META[level].icon,
    )
    expect(new Set(icons).size).toBe(icons.length)
  })
})
