import BaseModule from '@/modules/data/BaseModule'
import NotesCard from '@/modules/ui/NotesCard'
import PullRequestsCard from '@/modules/ui/PullRequestsCard'
import github from '@/query/github'
import { QueryPullRequest } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'

export type NotessModuleProps = {
  id?: string
  title?: string
  key: string
}

export default class NotessModule extends BaseModule<NotessModuleProps, string> {
  fetchData = async (clearCache?: boolean) => {
    return ''
  }

  render = () => {
    return <NotesCard title={this.props.title} module={this} />
  }
}
