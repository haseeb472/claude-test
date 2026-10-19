import { useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { workflowContent, workflowTabs } from '../../data/workflow'
import { Container } from '../ui/Container'

const tabId = (id: string) => `workflow-tab-${id}`
const panelId = (id: string) => `workflow-panel-${id}`
const statId = (id: string) => `workflow-stat-${id}`

export function Workflow() {
  const [activeId, setActiveId] = useState(workflowTabs[0].id)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const scrollerRef = useRef<HTMLDivElement>(null)

  const selectTab = (id: string) => {
    setActiveId(id)

    // On mobile the tab row scrolls sideways. Spread the scroll across the tabs:
    // the first tab sits at the left, the last one at the far right, so the
    // first tab is cropped at the left edge just like the last one is at the
    // right edge. Only the row scrolls, never the page.
    const scroller = scrollerRef.current
    if (!scroller) return

    const index = workflowTabs.findIndex((tab) => tab.id === id)
    const maxScroll = scroller.scrollWidth - scroller.clientWidth
    scroller.scrollTo?.({
      left: (index / (workflowTabs.length - 1)) * maxScroll,
      behavior: 'smooth',
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = workflowTabs.findIndex((tab) => tab.id === activeId)
    const last = workflowTabs.length - 1
    const nextIndex = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key]

    if (nextIndex === undefined) return

    event.preventDefault()
    const next = workflowTabs[nextIndex]
    selectTab(next.id)
    tabRefs.current[next.id]?.focus()
  }

  return (
    <section
      id="how-it-works"
      aria-labelledby="workflow-title"
      className="bg-white pt-6 md:py-14"
    >
      <Container>
        {/* 4px wider on each side on mobile: the banner sits 16px from the edge. */}
        <div className="-mx-1 overflow-hidden rounded-3xl bg-hero-gradient pb-14 md:mx-0 md:p-10 wide:flex wide:items-center wide:justify-between">
          <div className="pl-7.25 pr-6 pt-10 md:p-0 wide:min-w-0 wide:flex-1">
            <h2
              id="workflow-title"
              className="mb-2.5 text-banner-title text-ink md:mb-2"
            >
              {workflowContent.title}
            </h2>
            <p className="mb-3.5 text-body text-muted md:mb-6">
              {workflowContent.subtitle}
            </p>

            {/* The scroller reaches both banner edges on mobile; the tabs keep the page padding inside it. */}
            <div
              ref={scrollerRef}
              className="no-scrollbar -ml-7.25 -mr-6 mb-7 overflow-x-auto md:mx-0 md:mb-8 md:overflow-visible"
            >
              {/* Equal-width tabs: every column is as wide as the widest label. */}
              <div
                role="tablist"
                aria-label={workflowContent.tabsLabel}
                onKeyDown={handleKeyDown}
                className="grid w-max auto-cols-fr grid-flow-col gap-3 px-7.25 md:px-0"
              >
                {workflowTabs.map(({ id, label }) => {
                  const isActive = id === activeId

                  return (
                    <button
                      key={id}
                      ref={(element) => {
                        tabRefs.current[id] = element
                      }}
                      type="button"
                      role="tab"
                      id={tabId(id)}
                      aria-selected={isActive}
                      aria-controls={panelId(id)}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => selectTab(id)}
                      className="group relative overflow-hidden rounded-button bg-white px-5.125 py-2.75 text-small font-semibold text-ink transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-blue aria-selected:text-white"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-brand-gradient opacity-0 transition-opacity duration-300 group-aria-selected:opacity-100"
                      />
                      <span className="relative">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Height comes from the content plus this padding (it was 80px in the design). */}
            <div className="grid rounded-panel border border-line bg-white px-6 py-2.5 md:py-4.75 wide:max-w-tab-card">
              {workflowTabs.map(({ id, title, description }) => {
                const isActive = id === activeId

                return (
                  <div
                    key={id}
                    role="tabpanel"
                    id={panelId(id)}
                    aria-labelledby={tabId(id)}
                    aria-hidden={!isActive}
                    inert={!isActive}
                    data-active={isActive}
                    className="tab-panel col-start-1 row-start-1"
                  >
                    <h3 className="text-tab-title font-bold text-ink">
                      {title}
                    </h3>
                    <p className="text-small text-muted">{description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Height comes from the content plus this padding (179px mobile, 210px desktop in the design). */}
          <div className="mx-2.75 mt-6.375 grid rounded-2xl border border-line bg-white px-8 pb-9 pt-13 md:mx-0 md:mt-8 md:py-13 wide:mt-0 wide:w-full wide:max-w-stat-card wide:shrink-0">
            {workflowTabs.map(({ id, stat }) => {
              const isActive = id === activeId

              return (
                <div
                  key={id}
                  role="group"
                  id={statId(id)}
                  aria-labelledby={tabId(id)}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  data-active={isActive}
                  className="tab-panel col-start-1 row-start-1"
                >
                  <p className="mb-1 text-stat-display text-ink">
                    {stat.value}
                  </p>
                  <p className="mb-2.5 text-nav font-medium text-muted md:mb-6">
                    {stat.label}
                  </p>
                  {/* The track is as tall as its vertical padding; the fill stretches to it. */}
                  <div className="relative overflow-hidden rounded-lg bg-track py-2 wide:max-w-bar">
                    <div
                      className="tab-bar-fill absolute inset-y-0 left-0 rounded-lg bg-brand-gradient"
                      style={{ '--fill': `${stat.progress}%` } as CSSProperties}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
