import CardFrame from '@/modules/ui/CardFrame'
import { QueryIssue, QueryLabel } from '@/query/types'
import { formatDistance } from 'date-fns'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'

const IssuesCard = (props: ModuleCardProps<any, QueryIssue[]>) => {
  const { data, error, loading, refresh } = useDataModule(props.module)

  return (
    <CardFrame title={props.title} {...{ count: data?.length, error, loading, refresh }}>
      <div class="flex flex-col w-full gap-2">
        {data?.map((issue) => (
          <a
            href={issue.url}
            target="_blank"
            rel="noreferrer"
            key={issue.id}
            class="hover:bg-gray-100 cursor-pointer rounded-md -m-1 p-1"
          >
            <div class="text-xs flex gap-2 text-gray-500">
              <div class="text-teal-500">{issue.identifier}</div>
              {issue.priority ? <Priority issue={issue} /> : null}
              {issue.assignee && (
                <>
                  <div>&bull;</div>
                  <div>{issue.assignee.name}</div>
                </>
              )}
              {issue.labels && <Labels labels={issue.labels} />}
            </div>
            <div class="text-gray-800 text-sm">{issue.title}</div>
            <div class="text-gray-500 text-xs">
              {issue.completedAt
                ? `completed ${formatDistance(new Date(issue.completedAt!), new Date())} ago`
                : issue.startedAt
                ? `started ${formatDistance(new Date(issue.startedAt!), new Date())} ago`
                : `created ${formatDistance(new Date(issue.createdAt!), new Date())} ago`}
            </div>
          </a>
        ))}
        {data && !data?.length && <div class="my-8 self-center text-gray-400">Nothing to show</div>}
      </div>
    </CardFrame>
  )
}

const Labels = ({ labels }: { labels: QueryLabel[] }) => {
  if (!labels || labels.length == 0) return null

  return (
    <>
      <div>&bull;</div>
      {labels.map((label, i) => (
        <span key={i} style={{ color: label.color }}>
          {label.name}
        </span>
      ))}
    </>
  )
}

const Priority = ({ issue }: { issue: QueryIssue }) => {
  const color = issue.priority == 1 ? 'red' : issue.priority == 2 ? 'orange' : 'green'
  return (
    <>
      <div>&bull;</div>
      <span style={{ color: color }}>{issue.priorityLabel}</span>
    </>
  )
}

export default IssuesCard
