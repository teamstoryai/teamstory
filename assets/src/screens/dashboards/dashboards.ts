import { DataModuleProps } from '@/modules/DataModule'

export const DashboardMain = (dateKey: string, timelineStart: string): DataModuleProps[] => [
  {
    module: 'pull_requests',
    title: 'Open Pull Requests',
    query: 'is:open is:pr draft:false',
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

export const NeedsAttention = (dateKey: string): DataModuleProps[] => [
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
