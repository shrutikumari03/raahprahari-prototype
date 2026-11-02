import { createFileRoute, notFound } from '@tanstack/react-router'
import { MountainBanner } from '@/components/mountain-banner'
import { MapLegend, SchematicMap } from '@/features/routes/schematic-map'
import { SegmentDetail } from '@/features/routes/segment-detail'
import { segmentById } from '@/data/fixtures'
import { usePrefs } from '@/i18n/preferences'

export const Route = createFileRoute('/advisories/$segmentId')({
  loader: ({ params }) => {
    const segment = segmentById(params.segmentId)
    if (!segment) throw notFound()
    return { segment }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.segment.code ?? 'Road details'} · RaahPrahari` }],
  }),
  component: SegmentPage,
})

function SegmentPage() {
  const { t, place } = usePrefs()
  const { segment } = Route.useLoaderData()

  return (
    <div className="pb-8">
      <MountainBanner
        eyebrow={segment.code}
        title={`${place(segment.from)} – ${place(segment.to)}`}
        description={t('segment.title')}
      />
      <div className="rp-container grid gap-5 py-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.8fr)]">
        <div className="space-y-3">
          <SchematicMap
            highlight={[segment.id]}
            selectedSegmentId={segment.id}
            className="max-h-[70vh]"
          />
          <MapLegend />
        </div>
        <SegmentDetail segmentId={segment.id} />
      </div>
    </div>
  )
}
