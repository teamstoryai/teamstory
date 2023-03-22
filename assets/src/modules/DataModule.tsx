import ErrorMessage from '@/components/core/ErrorMessage'
import Pressable from '@/components/core/Pressable'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { RenderableProps } from 'preact'

type Props = {
  title: string
  refresh?: () => void
  error?: string | Error
}

const DataModule = ({ title, refresh, children, error }: RenderableProps<Props>) => {
  return (
    <div class="flex flex-col m-2 p-4 border border-gray-200 rounded-md flex-1 min-w-[400px] shadow">
      <div class="flex items-center mb-2">
        <h1 class="flex-1 text-lg font-semibold text-gray-800">{title}</h1>
        {refresh && (
          <Pressable onClick={refresh} tooltip="Refresh data">
            <ArrowPathIcon class="h-4 w-4 text-gray-400" />
          </Pressable>
        )}
      </div>

      {children}
      <ErrorMessage error={error} />
    </div>
  )
}

export default DataModule
