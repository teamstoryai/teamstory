import { DataModuleProps } from '@/modules/DataModuleFactory'
import { dateToYMD, pastTwoWeeksDates } from '@/stores/dataStore'
import { add, sub } from 'date-fns'

/**
 * supported variables:
 *
 * {{t}} - today in YYYY-MM-DD format
 * {{t-1}} - today - 1 day, etc
 * {{s}} - period start
 * {{e}} - period end
 */

export const DashboardModules = (dateKey: string, timelineStart: string): DataModuleProps[] => [
  {
    module: 'ai_summary',
    title: 'Latest updates',
    instructions: "Summary of the team's recent activity with one bullet point per person:",
    rememberKey: 'dashboard',
  },
  {
    id: 'team',
    module: 'team_current',
    title: 'Recent Activity by Team Member',
    updatedPulls: { updatedAfter: dateKey },
    updatedIssues: { updatedAfter: dateKey },
  },
  {
    id: 'open',
    module: 'pull_requests',
    title: 'New Open Pull Requests',
    filters: { open: true, createdAfter: dateKey },
  },
  {
    id: 'merged',
    module: 'pull_requests',
    title: 'Recently Merged Pull Requests',
    filters: { merged: true, mergedAfter: dateKey },
  },
  {
    id: 'in-progress',
    module: 'issues',
    title: 'Issues In Progress',
    filters: { started: true, open: true },
  },
  {
    id: 'completed',
    module: 'issues',
    title: 'Recently Completed',
    filters: { completedAfter: dateKey },
  },
]

export const NeedsAttentionModules = (dateKey: string): DataModuleProps[] => [
  {
    module: 'ai_summary',
    title: 'Top three actions:',
    instructions: 'Prioritize the top three actions I should take as the engineering manager:',
  },
  {
    module: 'pull_requests',
    title: 'Stale Pull Requests',
    filters: { open: true, createdBefore: dateKey },
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
      open: true,
      custom: {
        startedAt: { lt: new Date(dateKey) },
      },
    },
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
  endDate: Date,
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
      key: {
        type: '2w',
        start_date: startDateStr,
        end_date: endDateStr,
      },
      title: 'Reflections & Learnings',
    },
    {
      module: 'gantt',
      title: 'Activity Timeline',
      filters: {
        completedAfter: startDateStr,
        completedBefore: endDateStr,
      },
      startDate,
      endDate,
    },
    {
      module: 'pull_requests',
      title: 'Merged Pull Requests',
      filters: { merged: true, mergedAfter: startDateStr, mergedBefore: endDateStr },
    },
    {
      module: 'issues',
      title: 'Completed Issues',
      filters: { completedAfter: startDateStr, completedBefore: endDateStr },
    },
  ]
}
