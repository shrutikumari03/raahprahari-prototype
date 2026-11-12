import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const LOGO_FULL_ALT = 'RaahPrahari logo: mountain road with location pin. Know before you go.'

/** Square crop of the approved logo (mountain, road, pin). */
function MarkImage({ size, decorative, className }: { size: number; decorative?: boolean; className?: string }) {
  return (
    <img
      src="/img/logo-mark.png"
      width={size}
      height={size}
      alt={decorative ? '' : 'RaahPrahari'}
      decoding="async"
      className={cn('block shrink-0 rounded-lg bg-[#07151f] object-cover', className)}
      style={{ width: size, height: size }}
    />
  )
}

type LogoProps = {
  variant?: 'header' | 'mark' | 'full'
  className?: string
  /** Mark only: hide from assistive tech when next to a visible label. */
  decorative?: boolean
}

/** The one shared RaahPrahari logo. Uses the approved artwork as-is (cropped, never redrawn or recoloured). */
export function Logo({ variant = 'header', className, decorative }: LogoProps) {
  if (variant === 'mark') {
    return <MarkImage size={40} decorative={decorative} className={className} />
  }

  if (variant === 'full') {
    return (
      <div className={cn('inline-block w-full max-w-[16rem] overflow-hidden rounded-2xl bg-[#07151f] p-2', className)}>
        <img
          src="/img/logo-full.jpeg"
          width={1269}
          height={1239}
          alt={LOGO_FULL_ALT}
          decoding="async"
          className="block h-auto w-full rounded-xl"
        />
      </div>
    )
  }

  return (
    <Link
      to="/"
      aria-label="RaahPrahari home"
      className={cn('inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-md', className)}
    >
      <MarkImage size={36} decorative />
      <span aria-hidden className="font-display text-lg leading-none font-bold tracking-tight whitespace-nowrap text-foreground">
        Raah<span className="text-brand-orange">Prahari</span>
      </span>
    </Link>
  )
}
