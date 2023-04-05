import { API } from '@/api'
import { Learning, LearningKey } from '@/models'
import BaseModule from '@/modules/data/BaseModule'
import NotesCard from '@/modules/ui/NotesCard'
import { dataStore } from '@/stores/dataStore'
import { projectStore } from '@/stores/projectStore'

export type NotessModuleProps = {
  id?: string
  title?: string
  key: LearningKey
}

export default class NotessModule extends BaseModule<NotessModuleProps, Learning[]> {
  cacheKey = () => 'notes:' + JSON.stringify(this.props.key)

  fetchData = async (clearCache?: boolean) => {
    const key = this.cacheKey()
    if (clearCache) dataStore.clear(key)
    const project = projectStore.currentProject.get()!
    return dataStore.cacheRead(key, async () => {
      const result = await API.listLearnings(project, this.props.key)
      return result.items.map((i) => Learning.fromJSON(i))
    })
  }

  saveNotes = async (notes: string, privateNotes: string) => {
    const project = projectStore.currentProject.get()!
    const key = this.cacheKey()
    const prevNotes = dataStore.cache[key] || []
    const hadPrivateNotes = prevNotes.some((n: Learning) => n.is_you && n.private && n.content)

    const newNotes: Learning[] = []

    const response = await API.updateLearning(project, {
      key: this.props.key,
      content: notes,
      private: false,
    })
    newNotes.push(Learning.fromJSON(response.item))

    if (privateNotes || hadPrivateNotes) {
      const response = await API.updateLearning(project, {
        key: this.props.key,
        content: privateNotes,
        private: true,
      })
      if (privateNotes) newNotes.push(Learning.fromJSON(response.item))
    }

    if (prevNotes) {
      dataStore.cacheWrite(key, prevNotes.filter((n: Learning) => !n.is_you).concat(newNotes))
    }
  }

  render = () => {
    return <NotesCard title={this.props.title} module={this} />
  }
}
