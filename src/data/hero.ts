import type { HeroCheck, HeroStat, HeroTask } from '../types/hero'

export const heroContent = {
  badge: { tag: 'New', text: 'AI-powered workflow for modern teams ›' },
  title: {
    first: 'Work smarter.',
    second: 'Let AI handle',
    third: 'the repetitive work.',
  },
  subtitle:
    'FlowPilot helps modern teams plan work, automate repetitive tasks, and keep everyone aligned.',
  primaryCta: { label: 'Start Free', href: '#contact' },
  secondaryCta: { label: 'See How It Works', href: '#how-it-works' },
}

export const heroChecks: HeroCheck[] = [
  { label: 'No credit card required' },
  { label: 'Set up in minutes' },
  { label: 'Trusted by 10,000+ teams' },
]

export const mockupSidebar = [
  'Overview',
  'Tasks',
  'Automations',
  'Team',
  'Analytics',
  'Settings',
]

export const mockupGreeting = {
  title: 'Good morning, Sarah!',
  subtitle: "Here's what is happening with your team today.",
}

export const mockupStats: HeroStat[] = [
  { value: '12', label: 'Active Tasks', shortLabel: 'Active Tasks' },
  { value: '4', label: 'AI Suggestions', shortLabel: 'AI Suggest.' },
  { value: '85%', label: 'Project Progress', shortLabel: 'Progress' },
]

export const mockupTasks: HeroTask[] = [
  {
    title: 'Design landing page',
    shortTitle: 'Design landing page',
    status: 'In Progress',
  },
  {
    title: 'Update documentation',
    shortTitle: 'Update docs',
    status: 'Completed',
  },
  {
    title: 'Team sync meeting',
    shortTitle: 'Team sync',
    status: 'Upcoming',
  },
  {
    title: 'Review pull requests',
    shortTitle: 'Review PRs',
    status: 'Upcoming',
  },
]
