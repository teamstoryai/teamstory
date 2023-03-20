import Tooltip from '@/components/core/Tooltip'
import { classNames } from '@/utils'
import { CalendarIcon } from '@heroicons/react/24/outline'

export default function () {
  const calendarOpen = false

  const toggleCalendar = () => {
    const newSetting = !calendarOpen
  }

  return (
    <Tooltip message="Toggle Calendar" placement="left">
      <button
        type="button"
        onClick={toggleCalendar}
        className={classNames(
          'p-1 rounded-full',
          calendarOpen ? 'text-blue-400 hover:text-blue-500' : 'text-gray-400 hover:text-gray-500'
        )}
      >
        <span className="sr-only">Toggle Calendar</span>
        <CalendarIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </Tooltip>
  )
}
