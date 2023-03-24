import { Project, Repository } from '@/models'
import { QueryIssue, QueryPullRequest } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore, pastTwoWeeksDates, renderDates } from '@/stores/dataStore'
import { projectStore } from '@/stores/projectStore'
import { add, format, isMonday, previousMonday, sub } from 'date-fns'

export function initFakeData() {
  // add fake project

  const project: Project = {
    id: 'fake',
    name: 'Rocketship Inc',
    meta: {
      ob: 1,
    },
  }
  projectStore.activeProjects.set([...projectStore.activeProjects.get(), project])
  projectStore.projects.set([...projectStore.projects.get(), project])

  projectStore.projectSwitchListeners.push(onSwitchProject)
}

const today = new Date()

function onSwitchProject(project: Project) {
  const isFake = project.id == 'fake'
  dataStore.fakeMode = isFake
  connectStore.fakeMode = isFake

  if (isFake) {
    connectStore.repos.set(repos)
    const today = new Date()

    // --- for dashboard
    const openIssues: QueryIssue[] = [bugs[0], features[0], bugs[1], features[1]].map(
      titleToFeature(0, { startedAt: sub(today, { days: -1 }) })
    )
    const recentIssues: QueryIssue[] = [bugs[2], features[2], bugs[3], features[3]].map(
      titleToFeature(-6, {
        completedAt: sub(today, { days: -1 }),
      })
    )
    dataStore.cache['issues:{"open":true}'] = openIssues
    const recentKey = format(sub(today, { days: 2 }), 'yyyy-MM-dd')
    dataStore.cache[`issues:{"completedAfter":"${recentKey}"}`] = recentIssues
    const openPulls: QueryPullRequest[] = [pullTitles[0], pullTitles[1]].map(titleToPull(0, {}))
    dataStore.cache['rocketship/ship:pr:is:open is:pr draft:false'] = { items: openPulls }
    const closedPulls: QueryPullRequest[] = [pullTitles[2], pullTitles[3]].map(
      titleToPull(-5, {
        closed_at: sub(today, { days: -1 }).toISOString(),
      })
    )
    dataStore.cache[`rocketship/ship:pr:is:merged is:pr merged:>${recentKey}`] = {
      items: closedPulls,
    }

    // --- for past 2 weeks

    const { startDate, endDate } = pastTwoWeeksDates(today)
    const { startDateStr, endDateStr } = renderDates(startDate, endDate, today)

    const finishedIssues: QueryIssue[] = bugs
      .slice(4)
      .concat(features.slice(4))
      .map(titleToFeature(0, { completedAt: sub(today, { days: -1 }) }))

    // dataStore.cache['issues:{"open":true}'] = openIssues
    // const recentKey = format(sub(new Date(), { days: 2 }), 'yyyy-MM-dd')
    // dataStore.cache[`issues:{"completedAfter":"${recentKey}"}`] = recentIssues
    // const openPulls: QueryPullRequest[] = [pullTitles[0], pullTitles[1]].map(titleToPull(0, {}))
    // dataStore.cache['rocketship/ship:pr:is:open is:pr draft:false'] = { items: openPulls }
    // const closedPulls: QueryPullRequest[] = [pullTitles[2], pullTitles[3]].map(
    //   titleToPull(-5, {
    //     closed_at: sub(today, { days: -1 }).toISOString(),
    //   })
    // )
    // dataStore.cache[`rocketship/ship:pr:is:merged is:pr merged:>${recentKey}`] = {
    //   items: closedPulls,
    // }
  }
}

const titleToFeature =
  (idx: number, props: Partial<QueryIssue>) =>
  (title: string, i: number): QueryIssue => ({
    id: `${idx + i}`,
    identifier: `SPACE-${181 + Math.floor(idx + i * 2.5)}`,
    title,
    createdAt: sub(today, { days: 3 - i }),
    url: '',
    ...props,
  })

const titleToPull =
  (idx: number, props: Partial<QueryPullRequest>) =>
  (title: string, i: number): QueryPullRequest => ({
    title,
    number: 200 + idx + i,
    user: teamMembers[Math.abs(idx + i) % teamMembers.length],
    html_url: 'https://github.com/r-spacex/SpaceX-API/pull/' + (200 + idx + i),
    updated_at: today.toISOString(),
    created_at: sub(today, { days: 3 - i }).toISOString(),
    repo: repos[0].name,
    ...props,
  })

const repos: Repository[] = [
  {
    id: '1',
    name: 'rocketship/ship',
    base_url: 'api.github.com/repos/rocketship/ship',
    service: 'github',
  },
]

const teamMembers = [
  {
    id: '1',
    name: 'Emily Johnson',
    username: 'emilyj11',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'James Smith',
    username: 'jamess33',
    avatar_url: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Olivia Wilson',
    username: 'oliviaw8',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Ethan Lee',
    username: 'ethanl22',
    avatar_url: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: 'Sophia Brown',
    username: 'sophiab15',
    avatar_url: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    name: 'Daniel Kim',
    username: 'danielk34',
    avatar_url: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '7',
    name: 'Ava Davis',
    username: 'avad20',
    avatar_url: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: '8',
    name: 'Michael Rodriguez',
    username: 'michaelr19',
    avatar_url: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: '9',
    name: 'Isabella Martinez',
    username: 'isabellam7',
    avatar_url: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: '10',
    name: 'William Nguyen',
    username: 'williamn14',
    avatar_url: 'https://i.pravatar.cc/150?img=10',
  },
]

const bugs = [
  'Navigation system, malfunction causing course deviation',
  'Fuel leak in propulsion system',
  'Life support systems malfunctioning',
  'Communications array failure',
  'Emergency power system failure',
  'Thruster engine vibration causing structural stress',
  'Navigation computer software bug causing erratic behavior',
  'Malfunctioning airlock preventing entry to the ship',
  'Oxygen recycler malfunction causing CO2 buildup',
  'Solar panel deployment mechanism stuck',
  'Artificial gravity generator malfunctioning',
  'Data transmission errors from scientific equipment',
  'Temperature control system failure',
  'Micro-meteoroid puncture causing pressure loss',
  'Thruster fuel injector clogged',
  'Radiation shielding system malfunction',
  'Power distribution network overload causing intermittent outages',
  'Computer system hack resulting in data loss and system instability',
  'Microgravity causing disorientation and balance problems',
  'Control panel buttons malfunctioning and producing unexpected results',
]

const features = [
  'Automated course correction to avoid hazards',
  'Real-time monitoring of fuel levels and consumption',
  'Personalized temperature and humidity controls in crew quarters',
  'Augmented reality displays for better situational awareness',
  'Integrated emergency escape pods',
  'Automated repair drones for external maintenance',
  'Advanced communication system for faster data transmission',
  'Recyclable water and waste management system',
  'Smart food dispensing and meal planning system',
  'Artificial intelligence-based crew assistance system',
  'Advanced airlock system for enhanced safety and security',
  'Automated docking and undocking system',
  'Self-repairing outer hull material',
  'Advanced power management and storage system',
  'Health monitoring system for crew members',
  'Advanced propulsion system for faster travel',
  'Smart cargo management system for efficient storage and retrieval',
  'Advanced gravitational simulation system for crew exercise',
  'Comprehensive fault tolerance and self-healing system',
  'Advanced life support system for extended missions in space.',
]

const pullTitles = [
  'Fix navigation system bug',
  'Refactor engine control code',
  'Implement new power management system',
  'Add emergency air supply functionality',
  'Update telemetry dashboard design',
  'Resolve life support module issue',
  'Improve communication system performance',
  'Integrate new sensor array system',
  'Implement new fuel efficiency algorithm',
  'Fix minor docking port alignment bug',
  'Refactor thruster control code',
  'Upgrade radiation shielding system',
  'Add new data visualization feature',
  'Fix minor life support sensor bug',
  'Optimize power distribution system',
  'Implement new autopilot system',
  'Upgrade navigation system accuracy',
  'Add new communication encryption feature',
  'Fix minor power management bug',
  'Refactor telemetry data handling code',
]
