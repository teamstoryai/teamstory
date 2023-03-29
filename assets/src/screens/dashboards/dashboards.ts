import { DataModuleProps } from '@/modules/DataModule'
import { dateToYMD, pastTwoWeeksDates } from '@/stores/dataStore'

export const DashboardModules = (dateKey: string, timelineStart: string): DataModuleProps[] => [
  {
    module: 'pull_requests',
    title: 'New Open Pull Requests',
    query: `is:open is:pr draft:false created:>${dateKey}`,
  },
  {
    module: 'pull_requests',
    title: 'Recently Merged Pull Requests',
    query: `is:merged is:pr merged:>${dateKey}`,
  },
  {
    module: 'gantt',
    title: 'Activity Timeline',
    filters: {
      custom: {
        updatedAt: { gt: timelineStart as any },
        or: [{ startedAt: { null: false } }, { completedAt: { null: false } }],
      },
    },
  },
  {
    module: 'issues',
    title: 'Issues In Progress',
    filters: { started: true, open: true },
  },
  {
    module: 'issues',
    title: 'Recently Completed',
    filters: { completedAfter: dateKey },
  },
]

export const NeedsAttentionModules = (dateKey: string): DataModuleProps[] => [
  {
    module: 'pull_requests',
    title: 'Stale Pull Requests',
    query: `is:open is:pr draft:false created:<${dateKey}`,
  },
  {
    module: 'issues',
    title: 'New Bugs',
    filters: { open: true, label: 'bug', createdAfter: dateKey },
  },
  {
    module: 'issues',
    title: 'Priority Issues',
    filters: { open: true, priority: 2 },
  },
  {
    module: 'issues',
    title: 'Slow Issues',
    filters: {
      custom: {
        startedAt: { lt: new Date(dateKey) },
        completedAt: { null: true },
      },
    },
  },
]

export const TeamCurrentModules = (dateKey: string): DataModuleProps[] => [
  {
    module: 'team_current',
    title: 'Breakdown by Team Member',
    openPulls: 'is:open is:pr draft:false',
    mergedPulls: `is:merged is:pr merged:>${dateKey}`,
    openIssues: { started: true, open: true },
  },
]

export const ComingSoonModules = (): DataModuleProps[] => [
  {
    module: 'coming_soon',
    title: 'Coming Soon!',
  },
]

export const PastTwoWeeksModules = (
  startDate: Date,
  startDateStr: string,
  endDateStr: string
): DataModuleProps[] => {
  const { startDate: prevStart, endDate: prevEnd } = pastTwoWeeksDates(startDate)
  return [
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
}
