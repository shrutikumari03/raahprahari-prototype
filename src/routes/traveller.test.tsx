import { forwardRef } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PreferencesProvider } from '@/i18n/preferences'
import { segmentById } from '@/data/fixtures'
import { advisoryFor } from '@/lib/data'
import { ResultRow } from './traveller'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  const MockLink = forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<'a'> & { to?: string; params?: Record<string, string> }
  >((props, ref) => {
    const { to = '#', params, ...anchorProps } = props
    void params
    return <a ref={ref} href={to} {...anchorProps} />
  })
  MockLink.displayName = 'MockLink'
  return { ...actual, Link: MockLink }
})

describe('traveller search results', () => {
  it('does not render a cleared or verified status for a community-only segment', () => {
    const segment = segmentById('msr-01')
    if (!segment) throw new Error('Missing fixture segment "msr-01"')
    const advisory = advisoryFor(segment.id)
    expect(advisory?.restriction).toBeUndefined()
    expect(advisory?.evidence.some((report) => report.kind === 'clear')).toBe(true)

    render(
      <PreferencesProvider>
        <ResultRow
          segment={segment}
          observedAt={Date.parse('2026-10-15T02:30:00.000Z')}
          observedLabel="2 h ago"
          reason="Normal traffic, road dry."
        />
      </PreferencesProvider>,
    )

    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getByText('Community report, not independently verified')).toBeInTheDocument()
    expect(screen.queryByText(/^Cleared(?:\b|$)/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Verified$/i)).not.toBeInTheDocument()
    expect(document.querySelector('.traveller-restriction-detail')).toHaveTextContent(
      'Official restriction: No current official information',
    )
    expect(screen.getByRole('link', { name: /view details/i })).toBeInTheDocument()
  })
})
