import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PreferencesProvider, usePrefs } from './preferences'
import { STORAGE_KEYS } from '@/lib/storage'

function ThemeProbe() {
  const { theme, setTheme } = usePrefs()
  return (
    <div>
      <p>{theme}</p>
      <button onClick={() => setTheme('dark')}>Use dark</button>
      <button onClick={() => setTheme('system')}>Use system</button>
    </div>
  )
}

function setSystemPreference(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

describe('theme preference', () => {
  it('defaults to dark without a saved override', async () => {
    localStorage.clear()
    setSystemPreference(false)
    render(
      <PreferencesProvider>
        <ThemeProbe />
      </PreferencesProvider>,
    )

    expect(await screen.findByText('dark')).toBeVisible()
    await waitFor(() =>
      expect(document.documentElement).toHaveClass('dark'),
    )
  })

  it('uses the system preference only after the system theme is selected', async () => {
    localStorage.clear()
    setSystemPreference(false)
    const user = userEvent.setup()
    render(
      <PreferencesProvider>
        <ThemeProbe />
      </PreferencesProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Use system' }))
    await waitFor(() =>
      expect(document.documentElement).not.toHaveClass('dark'),
    )
    expect(screen.getByText('system')).toBeVisible()
  })

  it('loads and persists explicit overrides safely', async () => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify('light'))
    setSystemPreference(true)
    const user = userEvent.setup()
    render(
      <PreferencesProvider>
        <ThemeProbe />
      </PreferencesProvider>,
    )

    expect(await screen.findByText('light')).toBeVisible()
    await waitFor(() =>
      expect(document.documentElement.style.colorScheme).toBe('light'),
    )

    await user.click(screen.getByRole('button', { name: 'Use dark' }))
    await waitFor(() =>
      expect(document.documentElement).toHaveClass('dark'),
    )
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.theme) ?? 'null')).toBe(
      'dark',
    )

    await user.click(screen.getByRole('button', { name: 'Use system' }))
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.theme) ?? 'null')).toBe(
      'system',
    )
  })
})
