import IssuesModule, { IssuesModuleProps } from '@/modules/IssuesModule'
import PullRequestsModule, { PullRequestsModuleProps } from '@/modules/PullRequestsModule'

export type DataModuleProps =
  | ({ module: 'issues' } & IssuesModuleProps)
  | ({ module: 'pull_requests' } & PullRequestsModuleProps)

function DataModule(props: DataModuleProps) {
  switch (props.module) {
    case 'issues':
      return <IssuesModule {...props} />
    case 'pull_requests':
      return <PullRequestsModule {...props} />
    default:
      return null
  }
}

export default DataModule
