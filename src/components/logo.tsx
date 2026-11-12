import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const LOGO_FULL_ALT = 'RaahPrahari logo: mountain road with location pin. Know before you go.'

/** Square crop of the approved logo (mountain, road, pin). */
function MarkImage({ size, decorative, className }: { size: number; decorative?: boolean; className?: string }) {
  return (
    <>
      {/* Dark theme: the approved artwork on its dark tile. */}
      <img
        src="/img/logo-mark.png"
        width={size}
        height={size}
        alt={decorative ? '' : 'RaahPrahari'}
        decoding="async"
        className={cn('rp-logo-mark hidden shrink-0 rounded-lg bg-[#07151f] object-cover dark:block', className)}
        style={{ width: size, height: size }}
      />
      {/* Light theme: the same mark (mountain, road, pin) on a transparent tile, coloured by tokens. */}
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : 'RaahPrahari'}
        aria-hidden={decorative ? true : undefined}
        className={cn('rp-logo-mark-light block shrink-0 dark:hidden', className)}
        style={{ width: size, height: size }}
      >
        <path d="M2 34 L15 12 L22 23 L27 16 L38 34 Z" fill="var(--logo-hill)" />
        <path d="M13 17 L15 12 L17.5 16 L15 15 Z" fill="var(--logo-snow)" />
        <path d="M20 34 C20 28 26 28 26 23" fill="none" stroke="var(--logo-route)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30 4 a5 5 0 0 1 5 5 c0 4 -5 9 -5 9 s-5 -5 -5 -9 a5 5 0 0 1 5 -5 Z" fill="var(--logo-route)" />
        <circle cx="30" cy="9" r="1.8" fill="var(--background)" />
      </svg>
    </>
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
        Raah<span className="text-orange-on-light dark:text-brand-orange">Prahari</span>
      </span>
    </Link>
  )
}
