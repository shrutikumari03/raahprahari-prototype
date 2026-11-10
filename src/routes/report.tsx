import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/report')({
  validateSearch: (search: Record<string, unknown>) => ({
    segment: typeof search.segment === 'string' ? search.segment : undefined,
  }),
  component: ReportLayout,
})

function ReportLayout() {
  return <Outlet />
}
