import { format } from 'date-fns'
import { useCallback } from 'preact/hooks'

import CalendarWidget from '@/components/core/CalendarWidget'
import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'

type Props = {
  currentDate?: Date
  onSelect?: (date: Date) => void
}

type JournalDays = { [d: string]: boolean }

// from https://medium.com/@jain.jenil007/building-a-calendar-in-react-2c53b6ca3e96
export default (props: Props) => {
  const currentProject = useStore(projectStore.currentProject)

  const specialDaysFn = async (activeDate: Date) => {
    if (!currentProject) return
    const days = {}
    return { days: days, class: 'text-orange-500 font-semibold' }
  }

  return <CalendarWidget {...props} specialDaysFn={specialDaysFn} />
}
