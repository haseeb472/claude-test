import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

// The gradient call-to-action as a real button, for forms.
export function Button({
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex w-full items-center justify-center rounded-button bg-brand-gradient px-6 text-nav font-semibold text-white shadow-button transition duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
