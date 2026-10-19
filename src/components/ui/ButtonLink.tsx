import clsx from 'clsx'
import type { AnchorHTMLAttributes } from 'react'

type ButtonLinkVariant = 'primary' | 'outline'
type ButtonLinkSize = 'md' | 'lg'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonLinkVariant
  size?: ButtonLinkSize
}

const variantClasses: Record<ButtonLinkVariant, string> = {
  primary: 'bg-brand-gradient text-white shadow-button hover:opacity-90',
  outline: 'border border-line bg-white text-ink hover:bg-surface',
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-button px-6 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue',
        variantClasses[variant],
        size === 'md' && 'h-10.5 text-nav',
        size === 'lg' && [
          'h-11 md:h-12 md:text-body',
          variant === 'outline' ? 'text-small' : 'text-nav',
        ],
        className,
      )}
      {...props}
    />
  )
}
