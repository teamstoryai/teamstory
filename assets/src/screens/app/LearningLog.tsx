import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import AppBody from '@/components/layout/AppBody'
import PageTitle from '@/components/layout/PageTitle'
import { useEffect, useState } from 'preact/hooks'
import { API } from '@/api'
import { useStore } from '@nanostores/preact'
import { projectStore } from '@/stores/projectStore'
import { Learning, LearningKey } from '@/models'
import CardFrame from '@/modules/ui/CardFrame'

type Props = {
  path: string
}

const LearningLog = (props: Props) => {
  const project = useStore(projectStore.currentProject)
  const [learnings, setLearnings] = useState<Learning[]>([])

  useEffect(() => {
    if (!project) return
    API.listAllLearnings(project).then((response) => {
      setLearnings(response.items.map((i) => Learning.fromJSON(i)))
    })
  }, [])

  return (
    <>
      <AppHeader>
        <PageTitle title="Learning Log" />
      </AppHeader>
      <AppBody>
        {learnings.map((l, i) => (
          <CardFrame
            key={i}
            title={
              new Date(l.key.start_date).toLocaleDateString() +
              ' - ' +
              new Date(l.key.end_date).toLocaleDateString()
            }
          >
            <div class="flex flex-col">
              <span class="whitespace-pre-wrap">{l.content}</span>
              {l.private && <div class="text-gray-600">private</div>}
            </div>
          </CardFrame>
        ))}
      </AppBody>
    </>
  )
}
export default LearningLog
