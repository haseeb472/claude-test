import type { Testimonial } from '../types/testimonials'

export const testimonialsContent = {
  eyebrow: 'Testimonials',
  title: 'Loved by modern teams',
  subtitle: 'See how FlowPilot helps teams work smarter and save time.',
  previousLabel: 'Previous testimonial',
  nextLabel: 'Next testimonial',
  slidesLabel:
    'Testimonials. Use the left and right arrow keys, or drag, to change slides.',
}

// The Figma file only has the first testimonial. The other two are placeholders.
export const testimonials: Testimonial[] = [
  {
    quote:
      'FlowPilot has completely changed how our team works. We’re more organized, more productive, and spend less time on repetitive tasks.',
    shortQuote:
      'FlowPilot has completely changed how our team works. We’re more organized and spend less time on repetitive tasks.',
    name: 'Jessica Lee',
    role: 'Product Manager, Acme Inc.',
  },
  {
    quote:
      'The automations save our engineers hours every week. Planning and hand-offs finally feel effortless, and nothing slips through the cracks.',
    shortQuote:
      'The automations save our engineers hours every week. Hand-offs finally feel effortless.',
    name: 'Michael Chen',
    role: 'Engineering Lead, Northwind',
  },
  {
    quote:
      'Everyone on our team stays aligned without extra meetings, and projects now ship noticeably faster than they did before.',
    shortQuote:
      'Our team stays aligned without extra meetings, and projects ship faster.',
    name: 'Priya Patel',
    role: 'Operations Director, Globex',
  },
]
