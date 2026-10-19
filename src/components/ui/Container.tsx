import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

// Page gutters and the 1440px maximum width come from the `container` setting
// in tailwind.config.ts, so every section lines up with the header.
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('container', className)} {...props} />
}
