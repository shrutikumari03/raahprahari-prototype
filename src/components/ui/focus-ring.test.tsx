import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

/**
 * The focus ring on a glass menu is drawn by CSS rules that look at
 * data-open-source (see src/styles.css). jsdom cannot paint, so this checks
 * the attribute those rules depend on: it must follow how each open started,
 * on every open, not how the page loaded.
 */
function Menu({ onKeyDown }: { onKeyDown?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger onKeyDown={onKeyDown}>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>First</DropdownMenuItem>
        <DropdownMenuItem>Second</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const menu = () => document.querySelector('[data-slot="dropdown-menu-content"]')

describe('glass menu: how it was opened', () => {
  it('records a pointer open, so a mouse click draws no keyboard ring', async () => {
    const user = userEvent.setup()
    render(<Menu />)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(menu()).toHaveAttribute('data-open-source', 'pointer')
  })

  it('records a keyboard open, so the focused item gets the ring', async () => {
    const user = userEvent.setup()
    render(<Menu />)
    screen.getByRole('button', { name: 'Open menu' }).focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(menu()).toHaveAttribute('data-open-source', 'keyboard')
  })

  it('follows each open: a keyboard open after a pointer open is a keyboard open', async () => {
    const user = userEvent.setup()
    render(<Menu />)
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    await screen.findByRole('menu')
    expect(menu()).toHaveAttribute('data-open-source', 'pointer')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
    trigger.focus()
    await user.keyboard('{Enter}')
    await screen.findByRole('menu')
    expect(menu()).toHaveAttribute('data-open-source', 'keyboard')
  })

  it("still hands the menu element to the caller's own ref", async () => {
    const user = userEvent.setup()
    let received: HTMLDivElement | null = null
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent
          ref={(node) => {
            received = node
          }}
        >
          <DropdownMenuItem>First</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await screen.findByRole('menu')
    expect(received).toBe(menu())
  })

  it("still calls the caller's own key handler", async () => {
    let calls = 0
    const user = userEvent.setup()
    render(<Menu onKeyDown={() => (calls += 1)} />)
    screen.getByRole('button', { name: 'Open menu' }).focus()
    await user.keyboard('{Enter}')
    expect(calls).toBeGreaterThan(0)
  })
})
