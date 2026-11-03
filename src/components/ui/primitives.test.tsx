import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, IconButton } from './button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog'
import { EmptyState, ErrorState, LoadingState, SkipLink, VisuallyHidden } from './feedback'
import { Field } from './field'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { Textarea } from './textarea'

describe('shared UI primitives', () => {
  it('keeps buttons keyboard focusable, named, and disabled when requested', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Button>Save route</Button>
        <IconButton label="Close panel" icon={<span aria-hidden="true">×</span>} />
        <Button disabled>Unavailable</Button>
      </>,
    )

    await user.tab()
    expect(screen.getByRole('button', { name: 'Save route' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close panel' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Save route' })).toHaveClass('min-h-11')
  })

  it('connects visible field labels, helper text, required state and errors', () => {
    render(
      <Field
        label="Road name"
        description="Use the name shown on the route sign."
        error="Enter a road name."
        required
      >
        <Input />
      </Field>,
    )

    const input = screen.getByRole('textbox', { name: 'Road name' })
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? []
    expect(ids).toHaveLength(2)
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual([
      'Use the name shown on the route sign.',
      'Enter a road name.',
    ])
  })

  it('connects a field label and error state to a textarea', () => {
    render(
      <Field label="Observation" error="Describe what you observed.">
        <Textarea />
      </Field>,
    )

    const textarea = screen.getByRole('textbox', { name: 'Observation' })
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('-error'),
    )
  })

  it('opens and selects a Radix Select option with the keyboard', async () => {
    const user = userEvent.setup()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })
    render(
      <Field
        label="District"
        description="Choose the district."
        error="Choose a district."
      >
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose a district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dehradun">Dehradun</SelectItem>
            <SelectItem value="nainital">Nainital</SelectItem>
          </SelectContent>
        </Select>
      </Field>,
    )

    const trigger = screen.getByRole('combobox', { name: 'District' })
    expect(trigger).toHaveAttribute('aria-describedby', expect.stringContaining('-description'))
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    await user.tab()
    await user.keyboard('{Enter}{ArrowDown}{Enter}')
    await waitFor(() => expect(trigger).toHaveTextContent('Nainital'))
  })

  it('supports tab roles and arrow-key navigation', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="map">
        <TabsList aria-label="Advisory view">
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="map">Map panel</TabsContent>
        <TabsContent value="list">List panel</TabsContent>
      </Tabs>,
    )

    const mapTab = screen.getByRole('tab', { name: 'Map' })
    const listTab = screen.getByRole('tab', { name: 'List' })
    await user.tab()
    expect(mapTab).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(listTab).toHaveFocus()
    expect(listTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('List panel')).toBeVisible()
  })

  it('closes a dialog on Escape and restores focus to its trigger', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open details</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Road details</DialogTitle>
          <Button>First action</Button>
          <Button>Last action</Button>
        </DialogContent>
      </Dialog>,
    )

    const trigger = screen.getByRole('button', { name: 'Open details' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Road details' })).toBeVisible()
    const firstAction = screen.getByRole('button', { name: 'First action' })
    const lastAction = screen.getByRole('button', { name: 'Last action' })
    const closeButton = screen.getByRole('button', { name: 'Close' })
    await waitFor(() => expect(firstAction).toHaveFocus())
    await user.tab()
    expect(lastAction).toHaveFocus()
    await user.tab()
    expect(closeButton).toHaveFocus()
    await user.tab()
    expect(firstAction).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('announces loading politely without collapsing its reserved space', () => {
    render(<LoadingState label="Loading advisories" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveClass('min-h-24')
  })

  it('announces an error and invokes its explicit retry action', async () => {
    const retry = vi.fn()
    const user = userEvent.setup()
    render(
      <ErrorState
        title="Map unavailable"
        message="Use the list while the map is unavailable."
        onRetry={retry}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Use the list')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('explains the next step for empty state and keeps hidden text accessible', () => {
    render(
      <>
        <EmptyState title="No saved roads" message="Search for a route to save it." />
        <VisuallyHidden>Map marker description</VisuallyHidden>
        <SkipLink>Skip to content</SkipLink>
      </>,
    )

    expect(screen.getByText('Search for a route to save it.')).toBeVisible()
    expect(screen.getByText('Map marker description')).toHaveClass('sr-only')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main',
    )
  })
})
