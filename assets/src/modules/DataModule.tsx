import GanttModule, { GanttModuleProps } from '@/modules/GanttModule'
import IssuesModule, { IssuesModuleProps } from '@/modules/IssuesModule'
import NotesModule, { NotesModuleProps } from '@/modules/NotesModule'
import PullRequestsModule, { PullRequestsModuleProps } from '@/modules/PullRequestsModule'
import StatsModule, { StatsModuleProps } from '@/modules/StatsModule'

export type DataModuleProps =
  | ({ module: 'issues' } & IssuesModuleProps)
  | ({ module: 'pull_requests' } & PullRequestsModuleProps)
  | ({ module: 'gantt' } & GanttModuleProps)
  | ({ module: 'notes' } & NotesModuleProps)
  | ({ module: 'stats' } & StatsModuleProps)

function DataModule(props: DataModuleProps) {
  switch (props.module) {
    case 'issues':
      return <IssuesModule {...props} />
    case 'pull_requests':
      return <PullRequestsModule {...props} />
    case 'gantt':
      return <GanttModule {...props} />
    case 'notes':
      return <NotesModule {...props} />
    case 'stats':
      return <StatsModule {...props} />
    default:
      return null
  }
}

export default DataModule
