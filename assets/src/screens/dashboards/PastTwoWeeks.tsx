import { add, format, isMonday, isSameYear, previousMonday, sub } from 'date-fns'
import { DataModuleProps } from '@/modules/DataModule'
import PastDashboard from '@/screens/dashboards/PastDashboard'
import { dateToHumanDate, dateToYMD, pastTwoWeeksDates, renderDates } from '@/stores/dataStore'
import Suggestions, { Suggestion, suggestionFromParams } from '@/screens/dashboards/Suggestions'
import { useState } from 'preact/hooks'

type Props = {
  path: string
}

const suggestions: Suggestion[] = [
  { id: 'summary', label: 'Summarize what was done' },
  { id: 'hidden', label: 'What hidden work was not tracked?' },
  { id: 'slow', label: 'What took a long time?' },
  { id: 'team', label: 'Break down work by person' },
]

const PastTwoWeeks = (props: Props) => {
  const params = new URLSearchParams(location.search)
  const [suggestion, setSuggestion] = useState<Suggestion | undefined>(
    suggestionFromParams(params, suggestions)
  )

  const today = new Date()
  const { startDate, endDate } = pastTwoWeeksDates(today)

  const { startDateStr, endDateStr, startDateHuman, endDateHuman } = renderDates(
    startDate,
    endDate,
    today
  )

  const { startDate: prevStart, endDate: prevEnd } = pastTwoWeeksDates(startDate)

  const title = `Past Two Weeks (${startDateHuman} - ${endDateHuman})`

  const modules: DataModuleProps[] = [
    {
      module: 'stats',
      title: 'Issues Completed',
      currentPeriod: {
        completedAfter: startDateStr,
        completedBefore: endDateStr,
      },
      prevPeriod: {
        completedAfter: dateToYMD(prevStart),
        completedBefore: dateToYMD(prevEnd),
      },
    },
    {
      module: 'notes',
      key: `p2w-${startDateStr}`,
      title: 'Learnings',
    },
    {
      module: 'gantt',
      title: 'Activity Timeline',
      filters: {
        completedAfter: startDateStr,
        completedBefore: endDateStr,
      },
    },
    {
      module: 'pull_requests',
      title: 'Merged Pull Requests',
      query: `is:merged is:pr merged:${startDateStr}..${endDateStr}`,
    },
    {
      module: 'issues',
      title: 'Completed Issues',
      filters: { completedAfter: startDateStr, completedBefore: endDateStr },
    },
  ]

  return (
    <PastDashboard title={title} modules={modules}>
      <Suggestions {...{ suggestions, suggestion, setSuggestion }} />
    </PastDashboard>
  )
}

export default PastTwoWeeks
