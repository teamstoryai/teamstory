import { DataModuleProps } from '@/modules/DataModuleFactory'
import PastDashboard from '@/screens/dashboards/PastDashboard'
import { pastTwoWeeksDates, renderDates } from '@/stores/dataStore'
import Suggestions, { Suggestion, suggestionFromParams } from '@/screens/dashboards/Suggestions'
import { useState } from 'preact/hooks'
import { ComingSoonModules, PastTwoWeeksModules } from '@/screens/dashboards/dashboards'
import { startOfDay } from 'date-fns'
import useAnchorDate from '@/hooks/useAnchorDate'

type Props = {
  path: string
}

const suggestions: Suggestion[] = [
  { id: 'summary', label: 'Summarize what was done' },
  { id: 'team', label: 'Break down work by person' },
  { id: 'hidden', label: 'What hidden work was not tracked?' },
  { id: 'slow', label: 'What took a long time?' },
]

const PastTwoWeeks = (props: Props) => {
  const params = new URLSearchParams(location.search)
  const [suggestion, setSuggestion] = useState<Suggestion | undefined>(
    suggestionFromParams(params, suggestions)
  )

  const { anchorDate, prevPeriod, nextPeriod } = useAnchorDate(params, { days: 14 })

  const today = startOfDay(new Date())
  const { startDate, endDate } = pastTwoWeeksDates(startOfDay(anchorDate))

  const { startDateStr, endDateStr, startDateHuman, endDateHuman } = renderDates(
    startDate,
    endDate,
    today
  )

  const title = `Past Two Weeks (${startDateHuman} - ${endDateHuman})`

  const suggestionId = suggestion?.id
  const modules: DataModuleProps[] =
    suggestionId == 'summary'
      ? ComingSoonModules()
      : suggestionId == 'team'
      ? ComingSoonModules()
      : suggestionId == 'hidden'
      ? ComingSoonModules()
      : suggestionId == 'slow'
      ? ComingSoonModules()
      : PastTwoWeeksModules(startDate, startDateStr, endDate, endDateStr)

  return (
    <PastDashboard {...{ title, modules, prevPeriod, nextPeriod }}>
      <Suggestions {...{ suggestions, suggestion, setSuggestion }} />
    </PastDashboard>
  )
}

export default PastTwoWeeks
