import Router, { route } from 'preact-router'
import { useEffect } from 'preact/hooks'

import { paths } from '@/config'
import ProjectsList from '@/screens/app/ProjectsList'
import ProjectView from '@/screens/app/ProjectView'
import Settings from '@/screens/app/Settings'
import Dashboard from '@/screens/dashboards/Dashboard'
import LearningLog from '@/screens/app/LearningLog'
import ProjectSetup from '@/screens/setup/ProjectSetup'
import PastTwoWeeks from '@/screens/dashboards/PastTwoWeeks'
import PastMonth from '@/screens/dashboards/PastMonth'
import PastQuarter from '@/screens/dashboards/PastQuarter'
import TeamView from '@/screens/app/TeamView'
import AskTally from '@/screens/app/AskTally'

export default () => (
  <Router>
    <ProjectSetup path={paths.SETUP} />
    <Dashboard path={paths.DASHBOARD} />
    <LearningLog path={paths.LEARNING} />
    <PastTwoWeeks path={paths.PAST_WEEKS} />
    <PastMonth path={paths.PAST_MONTH} />
    <PastQuarter path={paths.PAST_QUARTER} />
    <TeamView path={paths.TEAM} />
    <AskTally path={paths.ASK_TALLY} />
    <ProjectsList path={paths.PROJECTS} />
    <ProjectView path={paths.PROJECTS + '/:id'} />
    <Settings path={paths.SETTINGS} />
    <Redirect path={paths.APP + '/:anything'} to={paths.DASHBOARD} />
    <Redirect path={paths.APP} to={paths.DASHBOARD} />
  </Router>
)

const Redirect = ({ to }: { to: string; path: string }) => {
  useEffect(() => {
    route(to)
  }, [])
  return null
}
