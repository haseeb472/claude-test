import collaborationIcon from '../assets/icons/feature-collaboration.svg'
import planningDesktopIcon from '../assets/icons/feature-planning-desktop.svg'
import planningMobileIcon from '../assets/icons/feature-planning-mobile.svg'
import type { Feature } from '../types/features'

export const featuresContent = {
  title: 'Everything your team needs to move faster',
  subtitle:
    'Powerful features to help you plan, automate and collaborate, all in one place.',
}

export const features: Feature[] = [
  {
    title: 'Smart Task Planning',
    description:
      'Automatically break down goals into actionable tasks with AI.',
    shortDescription: 'Break goals into actionable tasks.',
    icon: {
      type: 'image',
      desktopSrc: planningDesktopIcon,
      mobileSrc: planningMobileIcon,
    },
  },
  {
    title: 'AI Suggestions',
    description: 'Get intelligent suggestions to improve your workflow.',
    shortDescription: 'Get intelligent workflow suggestions.',
    icon: { type: 'glyph', glyph: 'AI', className: 'bg-accent-violet' },
  },
  {
    title: 'Team Collaboration',
    description: 'Keep everyone aligned with real-time updates.',
    shortDescription: 'Keep everyone aligned in real time.',
    icon: {
      type: 'image',
      desktopSrc: collaborationIcon,
      mobileSrc: collaborationIcon,
    },
  },
  {
    title: 'Automated Workflows',
    description: 'Save time by automating repetitive tasks.',
    shortDescription: 'Automate repetitive work.',
    icon: { type: 'glyph', glyph: '⚙', className: 'bg-accent-orange' },
  },
]
