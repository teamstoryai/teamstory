import { DataModuleProps } from '@/modules/DataModule'
import PastDashboard from '@/screens/dashboards/PastDashboard'

type Props = {
  path: string
}

const PastQuarter = (props: Props) => {
  const modules: DataModuleProps[] = []

  return <PastDashboard title="Past Quarter" modules={modules} />
}

export default PastQuarter
