import { useEffect, useSyncExternalStore } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Logo } from '@/components/logo'

/**
 * Start screen. It is part of the server-rendered HTML and is driven by the
 * inline `bootGuardScript`, which runs before the app's JavaScript:
 *
 * - Once per browser session (sessionStorage `rp.loading.shown`). A later load
 *   in the same tab session hides it before it can paint.
 * - Invisible for the first 300ms, so a fast load never flashes it.
 * - Fades out (250ms) when the app has hydrated, or at 800ms at the latest,
 *   whichever comes first. Reduced motion: hidden at once, no fade.
 * - Client-side navigation never shows it again: only the root renders it,
 *   and it is removed once it has gone.
 * - Without JavaScript it stays hidden (base CSS, plus the <noscript> rule).
 *
 * No progress is faked. The error state (a script failed to load, or 15s
 * without hydrating) still appears whatever the session flag says.
 */

export type BootState = 'loading' | 'error'

export const BOOT_SESSION_KEY = 'rp.loading.shown'
export const BOOT_REVEAL_MS = 300
export const BOOT_MAX_MS = 800
export const BOOT_FADE_MS = 250

export function BootScreen({ state = 'loading' }: { state?: BootState }) {
  const failed = state === 'error'
  return (
    // The guard script sets data-phase before hydration, so React must not
    // report that attribute as a mismatch.
    <div id="rp-boot" className="rp-boot" role="status" data-state={state} suppressHydrationWarning>
      <div data-boot-loading hidden={failed} className="rp-boot-body">
        <Logo variant="full" decorative className="rp-boot-logo" />
        <span className="sr-only">Loading RaahPrahari</span>
      </div>
      <div data-boot-error hidden={!failed} className="rp-boot-body rp-boot-error">
        <Logo variant="mark" decorative />
        <p className="rp-boot-title">
          <span lang="en">RaahPrahari could not load.</span>{' '}
          <span lang="hi">RaahPrahari लोड नहीं हो सका।</span>
        </p>
        <button type="button" data-boot-reload className="rp-boot-reload">
          <span lang="en">Reload</span> / <span lang="hi">पुनः लोड करें</span>
        </button>
      </div>
    </div>
  )
}

/**
 * Runs before hydration. Sets the start screen's phase on `data-phase`
 * (pending, shown, leaving, gone), applies the once-per-session rule and the
 * 800ms cap, switches to the error state if a script fails to load (or the
 * app has not hydrated after 15s), and wires the Reload button. It listens for
 * `rp-boot-ready` from BootGate and announces `rp-boot-done` once hidden.
 * Plain ES5 on purpose; sessionStorage and matchMedia can throw, so both are guarded.
 */
export const bootGuardScript = `(function(){var b=document.getElementById('rp-boot');if(!b)return;
var K='${BOOT_SESSION_KEY}',seen=false,rm=false,ready=false,done=false,leaving=false,timers=[];
try{seen=window.sessionStorage.getItem(K)==='1';window.sessionStorage.setItem(K,'1');}catch(x){}
try{rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(x){}
function clear(){for(var i=0;i<timers.length;i++)window.clearTimeout(timers[i]);timers=[];}
function gone(){clear();done=true;if(b.getAttribute('data-state')!=='error')b.setAttribute('data-phase','gone');window.dispatchEvent(new Event('rp-boot-done'));}
function hide(){if(done||leaving)return;clear();if(rm||b.getAttribute('data-phase')!=='shown'){gone();return;}leaving=true;b.setAttribute('data-phase','leaving');timers.push(window.setTimeout(gone,${BOOT_FADE_MS}));}
function fail(){clear();done=true;b.removeAttribute('data-phase');b.setAttribute('data-state','error');var l=b.querySelector('[data-boot-loading]'),e=b.querySelector('[data-boot-error]'),m=document.getElementById('main');if(l)l.hidden=true;if(e)e.hidden=false;if(m)m.removeAttribute('aria-busy');}
if(seen){gone();}else{b.setAttribute('data-phase','pending');timers.push(window.setTimeout(function(){if(!done&&!leaving)b.setAttribute('data-phase','shown');},${BOOT_REVEAL_MS}));timers.push(window.setTimeout(hide,${BOOT_MAX_MS}));}
window.addEventListener('rp-boot-ready',function(){ready=true;hide();});
window.setTimeout(function(){if(!ready&&document.getElementById('rp-boot'))fail();},15000);
window.addEventListener('error',function(ev){var t=ev.target;if(t&&t.tagName==='SCRIPT')fail();},true);
b.addEventListener('click',function(ev){var t=ev.target;if(t&&t.closest&&t.closest('[data-boot-reload]'))location.reload();});
})();`

function subscribeToBootDone(onStoreChange: () => void) {
  window.addEventListener('rp-boot-done', onStoreChange)
  return () => window.removeEventListener('rp-boot-done', onStoreChange)
}

/** Done once the start screen has gone, or when there is none to show. */
function getBootDone() {
  const boot = document.getElementById('rp-boot')
  return !boot || boot.getAttribute('data-phase') === 'gone'
}

/**
 * Keeps the start screen in the DOM while it fades, then removes it. On mount
 * (hydration) it clears the busy state and tells the guard script the app is
 * ready. Mounted once by the root, so route changes never bring it back.
 */
export function BootGate() {
  const done = useSyncExternalStore(subscribeToBootDone, getBootDone, () => false)
  useEffect(() => {
    document.getElementById('main')?.removeAttribute('aria-busy')
    window.dispatchEvent(new Event('rp-boot-ready'))
  }, [])
  if (done) return null
  return <BootScreen />
}

/** Slim top bar for route changes. Appears only if a navigation takes longer than ~150ms. */
export function RouteProgress() {
  const pending = useRouterState({ select: (s) => s.isLoading || s.status === 'pending' })
  if (!pending) return null
  return <div aria-hidden="true" className="rp-route-progress" />
}
