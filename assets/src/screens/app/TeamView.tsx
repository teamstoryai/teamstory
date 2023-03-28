import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import AppBody from '@/components/layout/AppBody'
import PageTitle from '@/components/layout/PageTitle'

type Props = {
  path: string
}

const TeamView = (props: Props) => {
  return (
    <>
      <AppHeader>
        <PageTitle title="Teams" />
      </AppHeader>
      <AppBody>
        <div>Coming soon: a way to define custom team membership to filter work.</div>
      </AppBody>
    </>
  )
}

export default TeamView
