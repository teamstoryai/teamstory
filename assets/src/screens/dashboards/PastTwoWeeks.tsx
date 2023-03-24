import { add, format, isMonday, isSameYear, previousMonday, sub } from 'date-fns'
import { DataModuleProps } from '@/modules/DataModule'
import PastDashboard from '@/screens/dashboards/PastDashboard'

type Props = {
  path: string
}

const PastTwoWeeks = (props: Props) => {
  const today = new Date()
  const keyMonday = isMonday(today) ? today : previousMonday(today)
  const startDate = sub(previousMonday(keyMonday), { weeks: 2 })
  const endDate = add(startDate, { days: 13 })

  const ymdFormat = 'yyyy-MM-dd'
  const localeFormat = 'ccc MMM d' + (isSameYear(startDate, today) ? '' : ', yyyy')

  const startDateStr = format(startDate, ymdFormat)
  const endDateStr = format(endDate, ymdFormat)

  const title = `Past Two Weeks (${format(startDate, localeFormat)} - ${format(
    endDate,
    localeFormat
  )})`

  const modules: DataModuleProps[] = [
    {
      module: 'stats',
      title: 'Summary',
    },
    {
      module: 'notes',
      key: `p2w-${startDateStr}`,
      title: 'Notes',
    },
    {
      module: 'gantt',
      title: 'Activity Timeline',
    },
    {
      module: 'pull_requests',
      title: 'Merged Pull Requests',
      query: `is:merged is:pr merged:>=${startDateStr} merged:<=${endDateStr}`,
    },
    {
      module: 'issues',
      title: 'Completed Issues',
      filters: { completedAfter: startDateStr, completedBefore: endDateStr },
    },
  ]

  return <PastDashboard title={title} modules={modules} />
}

export default PastTwoWeeks
