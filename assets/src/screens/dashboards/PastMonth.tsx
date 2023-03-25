import { DataModuleProps } from '@/modules/DataModule'
import PastDashboard from '@/screens/dashboards/PastDashboard'

type Props = {
  path: string
}

const PastMonth = (props: Props) => {
  const modules: DataModuleProps[] = []

  return <PastDashboard title="Past Month" modules={modules} />
}

export default PastMonth
