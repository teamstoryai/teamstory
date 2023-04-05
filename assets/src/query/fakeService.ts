import { CodeService, PRFilters } from '@/query/codeService'
import { fakeData } from '@/query/fakeData'
import { IssueFields, IssueFilters, IssueService } from '@/query/issueService'
import { QueryIssue, QueryPullRequest, QueryUser } from '@/query/types'
import { logger } from '@/utils'
import { differenceInCalendarDays } from 'date-fns'

class FakeService implements CodeService, IssueService {
  setToken(token: string): void {}
  pulls(repo: string, filters: PRFilters): Promise<QueryPullRequest[]> {
    const hasDateRange =
      filters.mergedAfter || filters.updatedAfter
        ? differenceInCalendarDays(
            new Date(),
            new Date(filters.mergedAfter || filters.updatedAfter!)
          )
        : false

    const max = hasDateRange ? hasDateRange : 5

    const pulls = fetchSome(fakeData.pullTitles, max).map((title) =>
      toPullRequest(title, repo, filters)
    )

    logger.info('FakeService.pulls', filters, pulls)

    return Promise.resolve(pulls)
  }

  issues(props: IssueFilters, fields: IssueFields): Promise<QueryIssue[]> {
    const hasDateRange =
      props.completedAfter || props.updatedAfter
        ? differenceInCalendarDays(
            new Date(),
            new Date(props.completedAfter || props.updatedAfter!)
          )
        : false
    const featureMax =
      props.label == 'bug' ? 0 : props.open ? 2 : hasDateRange ? hasDateRange / 2 : 4
    const bugMax = props.open ? 3 : hasDateRange ? hasDateRange : 5

    const additional: Partial<QueryIssue> = props.priority
      ? { priority: props.priority, priorityLabel: 'High' }
      : {}

    const features = fetchSome(fakeData.features, featureMax).map((title) =>
      toIssue(title, props, 'Feature', additional)
    )
    const bugs = fetchSome(fakeData.bugs, bugMax).map((title) =>
      toIssue(title, props, 'Bug', additional)
    )

    const result = [...features, ...bugs]
    logger.info('FakeService.issues', props, result)
    return Promise.resolve(result)
  }

  teamMembers(): Promise<QueryUser[]> {
    return Promise.resolve(fakeData.users)
  }

  aiSummary(prompt: string) {
    if (prompt.includes('top three actions')) {
      return `1. Address the \"Life support systems malfunctioning\" bug immediately as it is a priority issue that could potentially endanger the crew's lives. \n\n2. Review and evaluate the \"Advanced life support system for extended missions in space\" feature to determine its feasibility and potential impact on the mission. This should be done in a timely manner to avoid any delays in the mission timeline. \n\n3. Follow up with Emily Johnson to ensure that the \"Malfunctioning airlock preventing entry to the ship\" bug has been fully resolved and that the crew can safely enter and exit the ship. This is important for the safety and efficiency of the crew's operations`
    }
    return '* Emily Johnson completed the feature "Advanced life support system for extended missions in space."\n* Sophia Brown completed the feature "Real-time monitoring of fuel levels and consumption" and the bug "Thruster engine vibration causing structural stress."\n* The team started working on the feature "Self-repairing outer hull material."'
  }
}

function fetchOne<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function fetchSome<T>(array: T[], max?: number): T[] {
  const count = Math.floor(Math.random() * Math.min(max || 999, array.length))
  const someArray: T[] = []
  const startIndex = Math.floor(Math.random() * array.length)
  for (let i = 0; i < count; i++) {
    someArray.push(array[(startIndex + i) % array.length])
  }
  return someArray
}

function toPullRequest(
  title: string,
  repo: string,
  filters: PRFilters,
  additional?: Partial<QueryPullRequest>
): QueryPullRequest {
  const user = fetchOne(fakeData.users)
  const number = Math.floor(Math.random() * 1000)
  return {
    number,
    title,
    user,
    repo,
    html_url: 'https://sample.com/pull/' + number,
    created_at: dateInRange(
      filters.createdAfter || filters.updatedAfter,
      filters.createdBefore || filters.updatedBefore
    ),
    updated_at: dateInRange(filters.updatedAfter, filters.updatedBefore),
    closed_at: filters.open
      ? undefined
      : dateInRange(
          filters.mergedAfter || filters.updatedAfter,
          filters.mergedBefore || filters.updatedBefore
        ),
    comments: Math.floor(Math.random() * 100),
  }
}

function toIssue(
  title: string,
  props: IssueFilters,
  label: string | undefined,
  additional?: Partial<QueryIssue>
): QueryIssue {
  const assignee =
    props.open || props.completedAfter || props.completedBefore || Math.random() > 0.5
      ? fetchOne(fakeData.users)
      : undefined
  const color = label == 'Feature' ? 'blue' : label == 'Bug' ? 'red' : undefined
  const id = '' + Math.random()

  return {
    id,
    title,
    identifier: 'SPACE-' + Math.floor(Math.random() * 1000),
    url: 'https://sample.com/issues/' + id,
    createdAt: dateInRange(props.createdAfter || props.updatedAfter, props.createdBefore),
    completedAt: props.open
      ? undefined
      : dateInRange(props.completedAfter || props.updatedAfter, props.completedBefore),
    startedAt:
      props.started || !props.open ? dateInRange(props.updatedAfter, undefined) : undefined,
    labels: label ? [{ name: label, color }] : [],
    creator: fetchOne(fakeData.users),
    assignee,
    ...additional,
  }
}

function dateInRange(createdAfter: string | undefined, createdBefore: string | undefined): string {
  const start = createdAfter
    ? new Date(createdAfter)
    : new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
  const end = createdBefore ? new Date(createdBefore) : new Date()

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

export default new FakeService()
