import { dateToYMD } from '@/stores/dataStore'
import { add, sub } from 'date-fns'
import { useState } from 'preact/hooks'

export default function useAnchorDate(params: URLSearchParams, shiftDuration: Duration) {
  const [anchorDate, setAnchorDate] = useState<Date>(
    params.get('start') ? new Date(params.get('start')!) : new Date()
  )

  const updateAnchorDate = (date: Date) => {
    setAnchorDate(date)
    const url = new URL(location.href)
    url.searchParams.set('start', dateToYMD(date))
    history.pushState({}, '', url.toString())
  }

  const prevPeriod = () => updateAnchorDate(sub(anchorDate, shiftDuration))
  const nextPeriod =
    anchorDate.getTime() < Date.now()
      ? () => updateAnchorDate(add(anchorDate, shiftDuration))
      : undefined

  return { anchorDate, prevPeriod, nextPeriod }
}
