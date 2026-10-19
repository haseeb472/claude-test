import clsx from 'clsx'
import {
  mockupGreeting,
  mockupSidebar,
  mockupStats,
  mockupTasks,
} from '../../../data/hero'
import type { TaskStatus } from '../../../types/hero'
import { ResponsiveText } from '../../ui/ResponsiveText'

const statusClasses: Record<TaskStatus, string> = {
  'In Progress': 'text-status-progress',
  Completed: 'text-status-done',
  Upcoming: 'text-status-upcoming',
}

// Decorative preview of the product, hidden from assistive technology.
export function DashboardMockup() {
  return (
    <div
      aria-hidden="true"
      className="flex overflow-hidden rounded-card border border-line bg-white p-3.5 shadow-raised md:h-107.5 md:gap-4 md:p-4"
    >
      <div className="w-27.5 shrink-0 rounded-panel border border-hairline bg-surface p-2.5 md:w-37.5 md:border-0 md:p-4">
        <p className="mb-2.5 p-1 text-nav font-bold text-ink md:mb-4 md:p-0 md:text-logo md:tracking-normal">
          FlowPilot
        </p>
        <ul className="flex flex-col gap-1.5 md:gap-1">
          {mockupSidebar.map((item, index) => (
            <li
              key={item}
              className={clsx(
                'px-2 text-caption md:flex md:items-center md:px-3 md:text-nav',
                index === 0
                  ? 'flex h-6.5 items-center rounded-lg bg-active font-semibold text-brand-blue md:h-7.5'
                  : 'py-1 font-medium text-muted md:h-8 md:py-0',
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0 flex-1 pl-3 md:p-0 md:py-2 md:pr-2">
        <p className="text-body font-bold text-ink md:text-mock-title">
          {mockupGreeting.title}
        </p>
        <p className="text-tiny text-muted md:mt-1 md:text-caption">
          {mockupGreeting.subtitle}
        </p>

        <ul className="mt-2 flex gap-1.5 md:mt-3 md:gap-2.5">
          {mockupStats.map(({ value, label, shortLabel }) => (
            <li
              key={label}
              className="flex flex-1 flex-col items-center rounded-lg border border-line bg-card p-1 text-center md:h-20.5 md:items-start md:justify-center md:rounded-xl md:px-3 md:py-0 md:text-left"
            >
              <span className="text-body font-bold leading-none text-ink md:text-stat-value">
                {value}
              </span>
              <span className="mt-0.5 text-nano font-medium text-muted md:mt-1 md:text-caption">
                <ResponsiveText full={label} short={shortLabel} />
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-2.5 text-caption font-bold text-ink md:mt-5 md:text-body">
          Today&apos;s Tasks
        </p>
        <ul className="mt-1 md:mt-2">
          {mockupTasks.map(({ title, shortTitle, status }) => (
            <li
              key={title}
              className="flex items-center justify-between border-t border-divider py-1 md:py-2"
            >
              <span className="flex items-center gap-1.5 pr-1 md:gap-3 md:pr-0">
                <span className="size-3.5 shrink-0 rounded bg-checkbox md:size-4.5 md:rounded-md" />
                <span className="whitespace-nowrap text-tiny font-medium text-ink md:text-small">
                  <ResponsiveText full={title} short={shortTitle} />
                </span>
              </span>
              <span
                className={clsx(
                  'whitespace-nowrap text-mini font-semibold md:text-caption',
                  statusClasses[status],
                )}
              >
                {status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
