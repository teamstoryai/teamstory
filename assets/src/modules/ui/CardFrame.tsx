import ErrorMessage from '@/components/core/ErrorMessage'
import Loader from '@/components/core/Loader'
import Pressable from '@/components/core/Pressable'
import { logger } from '@/utils'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { RenderableProps } from 'preact'
import { twMerge } from 'tailwind-merge'

type Props = {
  title?: string
  count?: number
  loading?: boolean
  refresh?: () => void
  error?: string | Error
  className?: string
  headerActions?: JSX.Element
}

const ModuleCard = ({
  title,
  refresh,
  children,
  error,
  className,
  count,
  loading,
  headerActions,
}: RenderableProps<Props>) => {
  if (error) logger.error(error)
  return (
    <div
      class={twMerge(
        'flex flex-col m-2 p-4 border border-gray-200 rounded-md flex-1 min-w-[400px] shadow ' +
          'max-h-[500px] overflow-y-auto bg-white',
        className || ''
      )}
    >
      <div class="flex items-center mb-2">
        <h1 class="flex-1 text-lg font-semibold text-gray-800">
          {title}
          {count !== undefined ? ` (${count})` : null}
        </h1>
        {headerActions}
        {refresh && (
          <Pressable onClick={refresh} tooltip="Refresh data">
            <ArrowPathIcon class="h-4 w-4 text-gray-400" />
          </Pressable>
        )}
      </div>

      {loading && <Loader class="self-center" />}
      {children}
      <ErrorMessage error={error} />
    </div>
  )
}

export default ModuleCard
