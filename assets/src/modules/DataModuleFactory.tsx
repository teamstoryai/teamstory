import AISummaryModule, { AISummaryModuleProps } from '@/modules/data/AISummaryModule'
import BaseModule from '@/modules/data/BaseModule'
import IssuesModule, { IssuesModuleProps } from '@/modules/data/IssuesModule'
import PullRequestsModule, { PullRequestsModuleProps } from '@/modules/data/PullRequestsModule'
import TeamCurrentsModule, { TeamCurrentModuleProps } from '@/modules/data/TeamCurrentModule'

export type DataModuleProps =
  | ({ module: 'issues' } & IssuesModuleProps)
  | ({ module: 'ai_summary' } & AISummaryModuleProps)
  | ({ module: 'pull_requests' } & PullRequestsModuleProps)
  // | ({ module: 'gantt' } & GanttModuleProps)
  // | ({ module: 'notes' } & NotesModuleProps)
  // | ({ module: 'stats' } & StatsModuleProps)
  | ({ module: 'team_current' } & TeamCurrentModuleProps)
// | ({ module: 'coming_soon' } & ComingSoonModuleProps)

function DataModuleFactory(props: DataModuleProps): BaseModule<any, any> | null {
  switch (props.module) {
    case 'issues':
      return new IssuesModule(props)
    case 'ai_summary':
      return new AISummaryModule(props)
    case 'pull_requests':
      return new PullRequestsModule(props)
    //   return <PullRequestsModule {...props} />
    // case 'gantt':
    //   return <GanttModule {...props} />
    // case 'notes':
    //   return <NotesModule {...props} />
    // case 'stats':
    //   return <StatsModule {...props} />
    case 'team_current':
      return new TeamCurrentsModule(props)

    // case 'coming_soon':
    //   return <ComingSoonModule {...props} />
    default:
      return null
  }
}

export default DataModuleFactory
