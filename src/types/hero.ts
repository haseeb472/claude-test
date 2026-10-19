export type TaskStatus = 'In Progress' | 'Completed' | 'Upcoming'

export interface HeroStat {
  value: string
  label: string
  shortLabel: string
}

export interface HeroTask {
  title: string
  shortTitle: string
  status: TaskStatus
}

export interface HeroCheck {
  label: string
}
