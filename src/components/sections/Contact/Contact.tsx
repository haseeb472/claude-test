import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { UseFormRegisterReturn } from 'react-hook-form'
import chevronDesktop from '../../../assets/icons/chevron-down-desktop.svg'
import chevronMobile from '../../../assets/icons/chevron-down-mobile.svg'
import {
  contactContent,
  contactFields,
  demoTimeOptions,
  largeTeamSize,
  MESSAGE_MAX_LENGTH,
  teamSizeOptions,
} from '../../../data/contact'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { Button } from '../../ui/Button'
import { Collapse } from '../../ui/Collapse'
import { Container } from '../../ui/Container'
import { FieldError } from '../../ui/FieldError'
import { fieldClasses } from '../../ui/fieldStyles'
import { FormField } from '../../ui/FormField'
import { contactSchema } from './contactSchema'
import type { ContactFormValues } from './contactSchema'

// What is sent: the demo time is only included for the largest team size.
export type ContactSubmission = Omit<ContactFormValues, 'demoTime'> & {
  demoTime?: string
}

interface ContactProps {
  onSubmit?: (values: ContactSubmission) => Promise<void> | void
}

const sendMessage = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 800))

const errorProps = (id: string, error?: string) => ({
  'aria-required': true,
  'aria-invalid': Boolean(error),
  'aria-describedby': error ? `${id}-error` : undefined,
})

const controlPadding = 'px-3 py-1.75 md:px-3.5 md:py-2.5'

interface TextFieldProps {
  id: 'fullName' | 'workEmail' | 'companyName'
  label: string
  type?: string
  autoComplete: string
  placeholder: string
  error?: string
  registration: UseFormRegisterReturn
}

function TextField({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  error,
  registration,
}: TextFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={clsx(fieldClasses(Boolean(error)), controlPadding)}
        {...errorProps(id, error)}
        {...registration}
      />
    </FormField>
  )
}

interface SelectFieldProps {
  id: 'teamSize' | 'demoTime'
  label: string
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  error?: string
  registration: UseFormRegisterReturn
}

function SelectField({
  id,
  label,
  placeholder,
  options,
  value,
  error,
  registration,
}: SelectFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <div className="relative">
        <select
          id={id}
          data-empty={value === ''}
          className={clsx(
            fieldClasses(Boolean(error)),
            controlPadding,
            'appearance-none pr-9 data-[empty=true]:text-muted',
          )}
          {...errorProps(id, error)}
          {...registration}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-ink"
            >
              {option.label}
            </option>
          ))}
        </select>
        <img
          src={chevronMobile}
          alt=""
          className="pointer-events-none absolute right-2.25 top-1/2 -translate-y-1/2 md:hidden"
        />
        <img
          src={chevronDesktop}
          alt=""
          className="pointer-events-none absolute right-2.25 top-1/2 hidden -translate-y-1/2 md:block"
        />
      </div>
    </FormField>
  )
}

export function Contact({ onSubmit = sendMessage }: ContactProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    resetField,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      workEmail: '',
      companyName: '',
      teamSize: '',
      demoTime: '',
      message: '',
      terms: false,
    },
  })

  const teamSize = useWatch({ control, name: 'teamSize' })
  const demoTime = useWatch({ control, name: 'demoTime' })
  const message = useWatch({ control, name: 'message' })
  const showDemoTime = teamSize === largeTeamSize

  // Leaving the largest team size clears the demo time and any error on it.
  useEffect(() => {
    if (!showDemoTime) resetField('demoTime')
  }, [showDemoTime, resetField])

  const pick = (placeholder: { desktop: string; mobile: string }) =>
    isDesktop ? placeholder.desktop : placeholder.mobile

  const submit = handleSubmit(async ({ demoTime: time, ...values }) => {
    setSentTo(null)
    await onSubmit(showDemoTime ? { ...values, demoTime: time } : values)
    setSentTo(values.fullName.split(' ')[0])
    reset()
  })

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-white pb-12 pt-4 md:bg-hero-gradient md:py-20"
    >
      <Container className="wide:flex wide:items-start wide:justify-between wide:gap-12">
        <div className="wide:min-w-0 wide:flex-1 wide:pt-4">
          <p className="mb-2 hidden text-small font-bold uppercase tracking-wider text-brand-blue md:block">
            {contactContent.eyebrow}
          </p>
          <h2
            id="contact-title"
            className="text-contact-title-sm text-ink md:mb-2 md:text-contact-title"
          >
            {contactContent.title}
          </h2>
          <p className="mb-6 mt-1 text-small font-medium text-muted md:mb-8 md:mt-0 md:max-w-contact-copy md:pt-1.75 md:text-contact-copy md:font-normal wide:mb-0">
            {contactContent.description}
          </p>
        </div>

        <div className="md:rounded-2xl md:border md:border-line md:bg-white md:p-8 md:shadow-testimonial wide:w-full wide:max-w-contact-card wide:flex-none">
          <form noValidate onSubmit={submit} aria-label="Contact form">
            <div className="grid gap-3.5 md:grid-cols-2 md:gap-5">
              <TextField
                id="fullName"
                label={contactFields.fullName.label}
                autoComplete="name"
                placeholder={pick(contactFields.fullName.placeholder)}
                error={errors.fullName?.message}
                registration={register('fullName')}
              />
              <TextField
                id="workEmail"
                label={contactFields.workEmail.label}
                type="email"
                autoComplete="email"
                placeholder={pick(contactFields.workEmail.placeholder)}
                error={errors.workEmail?.message}
                registration={register('workEmail')}
              />
              <TextField
                id="companyName"
                label={contactFields.companyName.label}
                autoComplete="organization"
                placeholder={pick(contactFields.companyName.placeholder)}
                error={errors.companyName?.message}
                registration={register('companyName')}
              />
              <SelectField
                id="teamSize"
                label={contactFields.teamSize.label}
                placeholder={contactFields.teamSize.placeholder}
                options={teamSizeOptions}
                value={teamSize}
                error={errors.teamSize?.message}
                registration={register('teamSize')}
              />
            </div>

            {/* Only for the largest team size. Closed, it is hidden from the keyboard and screen readers. */}
            <Collapse open={showDemoTime}>
              <div className="pt-3.5 md:pt-5">
                <SelectField
                  id="demoTime"
                  label={contactFields.demoTime.label}
                  placeholder={contactFields.demoTime.placeholder}
                  options={demoTimeOptions}
                  value={demoTime}
                  error={errors.demoTime?.message}
                  registration={register('demoTime')}
                />
              </div>
            </Collapse>

            <FormField
              id="message"
              label={contactFields.message.label}
              error={errors.message?.message}
              className="mt-3.5 md:mt-4.75"
            >
              <div className="relative md:pb-1.5">
                <textarea
                  id="message"
                  rows={2}
                  maxLength={MESSAGE_MAX_LENGTH}
                  placeholder={pick(contactFields.message.placeholder)}
                  className={clsx(
                    fieldClasses(Boolean(errors.message)),
                    'resize-none px-2.75 pb-8.25 pt-2.75 md:px-3.25 md:pb-3.75 md:pt-3.25',
                  )}
                  {...errorProps('message', errors.message?.message)}
                  {...register('message')}
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-full right-0 mb-1 text-caption text-muted md:bottom-2.5 md:right-3 md:mb-0"
                >
                  {message.length}/{MESSAGE_MAX_LENGTH}
                </span>
              </div>
            </FormField>

            <div className="mt-3.5 pt-0.5 md:mt-4.75 md:pt-1.25">
              <label className="flex cursor-pointer items-start gap-2 text-caption-sm text-muted md:gap-1.5 md:text-caption">
                <span className="relative mt-0.5 flex shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...errorProps('terms', errors.terms?.message)}
                    {...register('terms')}
                  />
                  <span
                    aria-hidden="true"
                    className={clsx(
                      'size-3.5 rounded border bg-white transition duration-200 peer-checked:border-transparent peer-checked:bg-brand-blue peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue md:size-4 md:rounded-[3px]',
                      errors.terms ? 'border-red-500' : 'border-gray-500',
                    )}
                  />
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="pointer-events-none absolute inset-0 m-auto size-3 opacity-0 transition duration-200 peer-checked:opacity-100 md:size-3.5"
                  >
                    <path
                      d="M3 7.2l2.6 2.6L11 4.4"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  I agree to the{' '}
                  <a href="#terms" className="text-brand-blue md:text-muted">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-brand-blue md:text-muted">
                    Privacy Policy
                  </a>
                  <span className="md:hidden">.</span>
                  <span aria-hidden="true" className="hidden md:inline">
                    {' '}
                    *
                  </span>
                </span>
              </label>
              <FieldError id="terms-error" message={errors.terms?.message} />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-5.5 py-2.75 md:mt-4.75 md:py-3"
            >
              {isSubmitting ? contactContent.submitting : contactContent.submit}
            </Button>

            <Collapse open={sentTo !== null}>
              <p
                role="status"
                className="pt-4 text-small font-medium text-status-done"
              >
                <strong className="font-bold">
                  {contactContent.successTitle}.
                </strong>{' '}
                Thanks, {sentTo}! Our team will get back to you soon.
              </p>
            </Collapse>
          </form>
        </div>
      </Container>
    </section>
  )
}
