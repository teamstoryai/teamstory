import { DataModuleProps } from '@/modules/DataModuleFactory'
import PastDashboard from '@/screens/dashboards/PastDashboard'

type Props = {
  path: string
}

const PastMonth = (props: Props) => {
  const modules: DataModuleProps[] = []

  return (
    <PastDashboard title="Past Month" modules={modules}>
      <div>Coming Soon: an overview of your team's past month activity</div>
    </PastDashboard>
  )
}

export default PastMonth
