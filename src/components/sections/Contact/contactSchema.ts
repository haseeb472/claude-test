import { z } from 'zod'
import { largeTeamSize, MESSAGE_MAX_LENGTH } from '../../../data/contact'

const required = (message: string) => z.string().trim().min(1, message)

export const contactSchema = z
  .object({
    fullName: required('Full name is required').min(
      2,
      'Full name must be at least 2 characters',
    ),
    workEmail: required('Work email is required').pipe(
      z.email('Enter a valid email address, like you@company.com'),
    ),
    companyName: required('Company name is required'),
    teamSize: z.string().min(1, 'Select your team size'),
    demoTime: z.string(),
    message: required('Message is required')
      .min(10, 'Message must be at least 10 characters')
      .max(
        MESSAGE_MAX_LENGTH,
        `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer`,
      ),
    terms: z
      .boolean()
      .refine(
        (accepted) => accepted,
        'You must agree to the Terms of Service and Privacy Policy',
      ),
  })
  // The demo time is only required (and only checked) for the largest team size.
  .superRefine((values, context) => {
    if (values.teamSize === largeTeamSize && !values.demoTime) {
      context.addIssue({
        code: 'custom',
        path: ['demoTime'],
        message: 'Select a preferred demo time',
      })
    }
  })

export type ContactFormValues = z.infer<typeof contactSchema>
