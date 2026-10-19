export interface WorkflowStat {
  value: string
  label: string
  // How full the progress bar is, as a percentage.
  progress: number
}

export interface WorkflowTab {
  id: string
  label: string
  title: string
  description: string
  stat: WorkflowStat
}
