import BaseModule from '@/modules/data/BaseModule'
import NotesCard from '@/modules/ui/NotesCard'

export type NotessModuleProps = {
  id?: string
  title?: string
  type: string
  startDate: string
  endDate: string
}

export default class NotessModule extends BaseModule<NotessModuleProps, string> {
  fetchData = async (clearCache?: boolean) => {
    return ''
  }

  render = () => {
    return <NotesCard title={this.props.title} module={this} />
  }
}
