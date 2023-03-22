import DataModule from '@/modules/DataModule'
import { logger, unwrapError } from '@/utils'
import { useEffect, useState } from 'preact/hooks'
import type { Issue } from '@linear/sdk/dist/_generated_documents'
import linear from '@/query/linear'

type Props = {
  title: string
  before?: string
  after?: string
  open?: boolean
  completedAfter?: Date
}

const IssuesModule = (props: Props) => {
  const [error, setError] = useState('')
  const [issues, setIssues] = useState<Issue[]>([])

  const fetchData = (clear?: boolean) => {
    const filter = props.open
      ? {
          startedAt: {
            null: false,
          },
          completedAt: {
            null: true,
          },
        }
      : props.completedAfter
      ? {
          completedAt: {
            gte: props.completedAfter,
          },
        }
      : undefined

    linear.client
      .issues({
        after: props.after,
        before: props.before,
        filter,
      })
      .then((issues) => {
        logger.info('issues', issues)
        setIssues(issues.nodes as any[])
      })
      .catch((e) => {
        logger.error(e)
        setError(unwrapError(e))
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refresh = () => fetchData(true)

  return (
    <DataModule title={props.title} refresh={refresh} error={error}>
      <div class="flex flex-col w-full gap-2">
        {Object.values(issues)
          .flat()
          .map((issue) => (
            <a
              href={issue.url}
              target="_blank"
              rel="noreferrer"
              key={issue.id}
              class="hover:bg-gray-100 cursor-pointer rounded-md -m-1 p-1"
            >
              <div class="text-sm text-teal-500">{issue.identifier}</div>
              <div class="text-gray-800">{issue.title}</div>
            </a>
          ))}
      </div>
    </DataModule>
  )
}

export default IssuesModule
