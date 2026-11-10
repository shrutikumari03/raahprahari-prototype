import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ReportStepPage } from '@/features/reports/report-step-page'
import type { ReportPath } from '@/features/reports/report-step-page'

export const Route = createFileRoute('/report/received')({
  component: ReportReceivedPage,
})

function ReportReceivedPage() {
  const navigate = useNavigate()
  const go = (path: ReportPath) => {
    if (path === '/') void navigate({ to: path })
    else void navigate({ to: path, search: { segment: undefined } })
  }
  return <ReportStepPage step="received" navigate={go} />
}
