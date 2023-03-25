import ErrorMessage from '@/components/core/ErrorMessage'
import Pressable from '@/components/core/Pressable'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { RenderableProps } from 'preact'
import { twMerge } from 'tailwind-merge'

type Props = {
  title: string
  count?: number
  refresh?: () => void
  error?: string | Error
  className?: string
}

const ModuleCard = ({
  title,
  refresh,
  children,
  error,
  className,
  count,
}: RenderableProps<Props>) => {
  return (
    <div
      class={twMerge(
        'flex flex-col m-2 p-4 border border-gray-200 rounded-md flex-1 min-w-[400px] shadow max-h-[500px] overflow-y-auto',
        className || ''
      )}
    >
      <div class="flex items-center mb-2">
        <h1 class="flex-1 text-lg font-semibold text-gray-800">
          {title}
          {count ? ` (${count})` : null}
        </h1>
        {refresh && (
          <Pressable onClick={refresh} tooltip="Refresh data">
            <ArrowPathIcon class="h-4 w-4 text-gray-400" />
          </Pressable>
        )}
      </div>

      {!error && children}
      <ErrorMessage error={error} />
    </div>
  )
}

export default ModuleCard
