import AISummaryModule, { AISummaryModuleProps } from '@/modules/data/AISummaryModule'
import BaseModule from '@/modules/data/BaseModule'
import ComingSoonModule, { ComingSoonModuleProps } from '@/modules/data/ComingSoonModule'
import GanttModule, { GanttModuleProps } from '@/modules/data/GanttModule'
import IssuesModule, { IssuesModuleProps } from '@/modules/data/IssuesModule'
import NotessModule, { NotessModuleProps } from '@/modules/data/NotesModule'
import PullRequestsModule, { PullRequestsModuleProps } from '@/modules/data/PullRequestsModule'
import StatsModule, { StatsModuleProps } from '@/modules/data/StatsModule'
import TeamCurrentsModule, { TeamCurrentModuleProps } from '@/modules/data/TeamCurrentModule'

export type DataModuleProps =
  | ({ module: 'issues' } & IssuesModuleProps)
  | ({ module: 'ai_summary' } & AISummaryModuleProps)
  | ({ module: 'pull_requests' } & PullRequestsModuleProps)
  | ({ module: 'gantt' } & GanttModuleProps)
  | ({ module: 'notes' } & NotessModuleProps)
  | ({ module: 'stats' } & StatsModuleProps)
  | ({ module: 'team_current' } & TeamCurrentModuleProps)
  | ({ module: 'coming_soon' } & ComingSoonModuleProps)

function DataModuleFactory(props: DataModuleProps): BaseModule<any, any> | null {
  switch (props.module) {
    case 'issues':
      return new IssuesModule(props)
    case 'ai_summary':
      return new AISummaryModule(props)
    case 'pull_requests':
      return new PullRequestsModule(props)
    case 'gantt':
      return new GanttModule(props)
    case 'notes':
      return new NotessModule(props)
    case 'stats':
      return new StatsModule(props)
    case 'team_current':
      return new TeamCurrentsModule(props)
    case 'coming_soon':
      return new ComingSoonModule(props)
    default:
      return null
  }
}

export default DataModuleFactory
