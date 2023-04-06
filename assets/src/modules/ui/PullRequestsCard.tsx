import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'
import { QueryPullRequest } from '@/query/types'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { formatDistance } from 'date-fns'

const PullRequestsCard = (props: ModuleCardProps<any, QueryPullRequest[]>) => {
  const { data, error, loading, refresh } = useDataModule(props.module)

  return (
    <CardFrame title={props.title} {...{ count: data?.length, error, loading, refresh }}>
      <div class="flex flex-col w-full gap-2">
        {data?.map((pr) => (
          <a
            href={pr.html_url}
            target="_blank"
            rel="noreferrer"
            key={pr.number}
            class="hover:bg-gray-100 cursor-pointer rounded-md -m-1 p-1 flex items-center"
          >
            <div class="flex-1">
              <div class="text-xs text-teal-500">{pr.repo}</div>
              <div class="text-gray-800 text-sm">{pr.title}</div>
              <div class="text-gray-500 text-xs">
                {!pr.closed_at ? (
                  <>
                    #{pr.number} opened {formatDistance(new Date(pr.created_at), new Date())} ago by{' '}
                    {pr.user?.name || 'unknown'}
                  </>
                ) : (
                  <>
                    #{pr.number} by {pr.user?.name || 'unknown'} was merged{' '}
                    {formatDistance(new Date(pr.closed_at), new Date())} ago
                  </>
                )}
              </div>
            </div>
            {pr.comments > 0 && (
              <div class="flex text-gray-400">
                <ChatBubbleLeftIcon class="h-4 w-4 mr-2" />
                <div class="text-xs">{pr.comments}</div>
              </div>
            )}
          </a>
        ))}
        {data && !data.length && <div class="my-8 self-center text-gray-400">Nothing to show</div>}
      </div>
    </CardFrame>
  )
}

export default PullRequestsCard
