import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sourceDirectory = resolve(process.cwd(), 'src')

function cssFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return cssFiles(path)
    return entry.isFile() && entry.name.endsWith('.css') ? [path] : []
  })
}

function greenHue(color: string): boolean {
  if (/\b(?:green|lime|chartreuse|lawngreen|seagreen|olive|yellowgreen)\b/i.test(color)) {
    return true
  }
  const hsl = color.match(/hsla?\(\s*(-?[\d.]+)(?:deg)?/i)
  if (hsl) {
    const hue = ((Number(hsl[1]) % 360) + 360) % 360
    return hue >= 75 && hue <= 165
  }
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  const rgb = hex
    ? hex[1].length === 3
      ? hex[1].split('').map((digit) => Number.parseInt(digit + digit, 16))
      : [0, 2, 4].map((index) => Number.parseInt(hex[1].slice(index, index + 2), 16))
    : color.match(/rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/i)?.slice(1).map(Number)
  if (!rgb) return false

  const [red, green, blue] = rgb.map((value) => value / 255)
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  if (delta < 0.08) return false
  let hue =
    max === red
      ? 60 * (((green - blue) / delta) % 6)
      : max === green
        ? 60 * ((blue - red) / delta + 2)
        : 60 * ((red - green) / delta + 4)
  if (hue < 0) hue += 360
  return hue >= 75 && hue <= 165
}

describe('SH-15 status token colors', () => {
  it('keeps unknown, stale, and closed status tokens out of green hues', () => {
    const declarations: { token: string; value: string }[] = []
    const variables = new Map<string, string>()

    for (const file of cssFiles(sourceDirectory)) {
      const source = readFileSync(file, 'utf8')
      for (const match of source.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
        variables.set(match[1], match[2].trim())
        if (/^--(?:color-)?status-(?:unknown|stale|closed)$/.test(match[1])) {
          declarations.push({ token: match[1], value: match[2].trim() })
        }
      }
    }

    expect(declarations.length).toBeGreaterThan(0)
    for (const { token, value } of declarations) {
      let resolved = value
      for (let attempt = 0; attempt < 8; attempt++) {
        const reference = resolved.match(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/)
        if (!reference) break
        resolved = variables.get(reference[1]) ?? reference[2] ?? ''
      }
      expect(greenHue(resolved), `${token}: ${value} resolves to ${resolved}`).toBe(false)
    }
  })
})
