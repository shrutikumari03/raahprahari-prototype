import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const LOGO_ALT = 'RaahPrahari'

/** Real pixel sizes of the two transparent theme files in public/img. */
const LIGHT = { src: '/img/logo-on-light.jpeg', width: 1448, height: 1086 }
const DARK = { src: '/img/logo-on-dark.jpeg', width: 1269, height: 1240 }

/**
 * Both theme files are always in the DOM; CSS (`.dark` on <html>) shows exactly one,
 * so there is no flash on reload. The light file is the default and carries the alt text;
 * the dark one is hidden from assistive tech so the name is read once.
 */
function ThemedImages({ imgClassName }: { imgClassName: string }) {
  return (
    <>
      <img
        src={LIGHT.src}
        width={LIGHT.width}
        height={LIGHT.height}
        alt={LOGO_ALT}
        decoding="async"
        data-logo-theme="light"
        className={cn('block dark:hidden', imgClassName)}
      />
      <img
        src={DARK.src}
        width={DARK.width}
        height={DARK.height}
        alt=""
        aria-hidden="true"
        decoding="async"
        data-logo-theme="dark"
        className={cn('hidden dark:block', imgClassName)}
      />
    </>
  )
}

type LogoProps = {
  variant?: 'header' | 'mark' | 'full'
  className?: string
  /** Hide from assistive tech when next to a visible label. */
  decorative?: boolean
}

/** The one shared RaahPrahari logo. Uses the two theme files as-is: no filter, tile or box. */
export function Logo({ variant = 'header', className, decorative }: LogoProps) {
  if (variant === 'header') {
    return (
      <Link
        to="/"
        aria-label="RaahPrahari home"
        className={cn('inline-flex min-h-11 shrink-0 items-center rounded-md', className)}
      >
        <ThemedImages imgClassName="h-9 w-auto max-w-none" />
      </Link>
    )
  }

  const imgClassName = variant === 'mark' ? 'h-10 w-auto' : 'h-auto w-full'
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : LOGO_ALT}
      aria-hidden={decorative ? true : undefined}
      className={cn(variant === 'full' ? 'block w-full max-w-[16rem]' : 'inline-block shrink-0', className)}
    >
      <ThemedImages imgClassName={imgClassName} />
    </span>
  )
}
