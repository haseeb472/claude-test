import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CollapseProps {
  open: boolean
  children: ReactNode
  className?: string
}

// Opens and closes smoothly to the height of its content, with no fixed
// height: the grid row animates between 0fr and 1fr. While closed, the content
// is hidden from assistive technology and cannot be focused.
export function Collapse({ open, children, className }: CollapseProps) {
  return (
    <div
      aria-hidden={!open}
      inert={!open}
      className={clsx(
        'grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none',
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        className,
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
