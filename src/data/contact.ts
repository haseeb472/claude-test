export const contactContent = {
  eyebrow: 'Get in touch',
  title: "Let's build the future together",
  description:
    'Have questions? Want a demo? Send us a message and our team will get back to you.',
  submit: 'Send Message',
  submitting: 'Sending…',
  successTitle: 'Message sent',
}

// Placeholders differ between the desktop and mobile designs.
export const contactFields = {
  fullName: {
    label: 'Full Name',
    placeholder: { desktop: 'John Doe', mobile: 'Sarah Connor' },
  },
  workEmail: {
    label: 'Work Email',
    placeholder: { desktop: 'you@company.com', mobile: 'sarah@company.com' },
  },
  companyName: {
    label: 'Company Name',
    placeholder: { desktop: 'Acme Inc.', mobile: 'Acme Studio' },
  },
  teamSize: { label: 'Team Size', placeholder: 'Select team size' },
  demoTime: { label: 'Preferred Demo Time', placeholder: 'Select a time' },
  message: {
    label: 'Message',
    placeholder: {
      desktop: 'Tell us about your needs…',
      mobile: "Tell us about your team's workflow challenges...",
    },
  },
}

export const MESSAGE_MAX_LENGTH = 300

// Choosing this team size asks for a preferred demo time.
export const largeTeamSize = '200+'

// The Figma file only shows the placeholder, not the options. These are written to fit.
export const teamSizeOptions = [
  { value: '1-10', label: '1 - 10 members' },
  { value: '11-50', label: '11 - 50 members' },
  { value: '51-200', label: '51 - 200 members' },
  { value: largeTeamSize, label: '200+ members' },
]

export const demoTimeOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
]
