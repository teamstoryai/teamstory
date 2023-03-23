import { format, sub } from 'date-fns'
import { DataModuleProps } from '@/modules/DataModule'
import PastDashboard from '@/screens/dashboards/PastDashboard'

type Props = {
  path: string
}

const PastTwoWeeks = (props: Props) => {
  const recentKey = format(sub(new Date(), { days: 2 }), 'yyyy-MM-dd')

  const modules: DataModuleProps[] = [
    {
      module: 'pull_requests',
      title: 'Open Pull Requests',
      query: 'is:open is:pr draft:false',
    },
    {
      module: 'pull_requests',
      title: 'Recently Merged Pull Requests',
      query: `is:merged is:pr merged:>${recentKey}`,
    },
    {
      module: 'issues',
      title: 'Issues In Progress',
      open: true,
    },
    {
      module: 'issues',
      title: 'Recently Completed',
      completedAfter: recentKey,
    },
  ]

  return <PastDashboard title="Past Two Weeks" modules={modules} />
}

export default PastTwoWeeks
