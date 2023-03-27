import { add, format, isMonday, isSameYear, previousMonday, sub } from 'date-fns'
import { DataModuleProps } from '@/modules/DataModule'
import PastDashboard from '@/screens/dashboards/PastDashboard'
import { dateToHumanDate, dateToYMD, pastTwoWeeksDates, renderDates } from '@/stores/dataStore'
import Suggestions from '@/screens/dashboards/Suggestions'

type Props = {
  path: string
}

const PastTwoWeeks = (props: Props) => {
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

  const suggestions = [
    'Summarize what was done',
    'What hidden work was not tracked?',
    'What took a long time?',
    'Break down work by person',
  ]

  return (
    <PastDashboard title={title} modules={modules}>
      <Suggestions suggestions={suggestions} />
    </PastDashboard>
  )
}

export default PastTwoWeeks
