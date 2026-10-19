import clsx from 'clsx'
import type { ReactNode } from 'react'
import { FieldError } from './FieldError'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}

// A label, the control, and its error message. The asterisk only shows from
// `md`, as in the design; the controls themselves are marked as required.
export function FormField({
  id,
  label,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <label
        htmlFor={id}
        className="mb-1 text-small font-medium text-ink md:mb-1.5 md:text-nav md:font-semibold"
      >
        {label}
        <span aria-hidden="true" className="hidden md:inline">
          {' '}
          *
        </span>
      </label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}
