import DayView from '@/components/calendar/DayView'
import MonthView from '@/components/calendar/MonthView'
import { uiStore } from '@/stores/uiStore'
import { useStore } from '@nanostores/preact'

export default function () {
  const calendarOpen = false
  const selectedDate = useStore(uiStore.calendarDate)

  if (!calendarOpen) return null

  const onSelectDate = (d: Date) => {
    // TODO
  }

  return (
    <>
      <div className="w-52 xl:w-72 relative z-0">
        <div className="w-52 xl:w-72 bg-white border-l fixed top-0 right-0 flex flex-col h-full pt-2 z-20">
          <MonthView currentDate={selectedDate} onSelect={onSelectDate} />
          <hr className="my-4" />
          <DayView date={selectedDate} />
        </div>
      </div>
    </>
  )
}
