import useTippy from '@/hooks/useTippy'
import { classNames } from '@/utils'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { useRef } from 'preact/hooks'

export default function () {
  const ref = useRef<HTMLButtonElement>(null)
  const calendarOpen = false

  const toggleCalendar = () => {
    const newSetting = !calendarOpen
  }

  useTippy(ref, 'Toggle Calendar')

  return (
    <button
      ref={ref}
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
  )
}
