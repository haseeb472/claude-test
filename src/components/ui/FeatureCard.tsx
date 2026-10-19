import clsx from 'clsx'
import type { Feature, FeatureIcon } from '../../types/features'
import { ResponsiveText } from './ResponsiveText'

function FeatureCardIcon({ icon }: { icon: FeatureIcon }) {
  if (icon.type === 'glyph') {
    return (
      <div
        aria-hidden="true"
        className={clsx(
          'flex size-11 shrink-0 items-center justify-center rounded-xl text-logo font-bold tracking-normal text-white md:mb-5',
          icon.className,
        )}
      >
        {icon.glyph}
      </div>
    )
  }

  if (icon.desktopSrc === icon.mobileSrc) {
    return <img src={icon.desktopSrc} alt="" className="shrink-0 md:mb-5" />
  }

  return (
    <>
      <img src={icon.mobileSrc} alt="" className="shrink-0 md:hidden" />
      <img
        src={icon.desktopSrc}
        alt=""
        className="mb-5 hidden shrink-0 md:block"
      />
    </>
  )
}

// A row on mobile, a vertical card from `md` up.
export function FeatureCard({
  title,
  description,
  shortDescription,
  icon,
}: Feature) {
  return (
    <article className="flex h-19 items-center gap-3.5 rounded-panel border border-line bg-white p-3.5 md:h-50 md:flex-col md:items-start md:gap-0 md:rounded-2xl md:p-6">
      <FeatureCardIcon icon={icon} />
      <div className="min-w-0 md:w-full">
        <h3 className="whitespace-nowrap text-card-title-sm font-bold text-ink md:mb-1.5 md:text-base">
          {title}
        </h3>
        {/* On mobile the text column is as wide as the title, so the copy wraps to it. */}
        <p className="w-0 min-w-full pt-0.5 text-caption text-muted md:w-auto md:min-w-0 md:pt-0 md:text-card-copy">
          <ResponsiveText full={description} short={shortDescription} />
        </p>
      </div>
    </article>
  )
}
