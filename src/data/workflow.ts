import type { WorkflowTab } from '../types/workflow'

export const workflowContent = {
  title: 'Plan, automate, collaborate',
  subtitle: 'One workflow, three ways to move work forward.',
  tabsLabel: 'Workflow steps',
}

// The Figma file only shows the "Plan" tab. The "Automate" and "Collaborate"
// copy and numbers are placeholders written in the same shape.
export const workflowTabs: WorkflowTab[] = [
  {
    id: 'plan',
    label: 'Plan',
    title: 'Break goals into clear tasks',
    description:
      'AI-assisted planning keeps priorities visible and actionable.',
    // The design shows a 40% value with a bar filled to 66.6%.
    stat: { value: '40%', label: 'Less manual work', progress: 66.6 },
  },
  {
    id: 'automate',
    label: 'Automate',
    title: 'Automate repetitive work',
    description:
      'Workflows handle routine steps automatically, so nothing slips.',
    stat: { value: '65%', label: 'Faster task completion', progress: 65 },
  },
  {
    id: 'collaborate',
    label: 'Collaborate',
    title: 'Keep everyone aligned',
    description: 'Share updates in real time so every teammate stays in sync.',
    stat: { value: '85%', label: 'Better team alignment', progress: 85 },
  },
]
