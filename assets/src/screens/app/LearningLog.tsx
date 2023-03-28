import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import AppBody from '@/components/layout/AppBody'
import PageTitle from '@/components/layout/PageTitle'

type Props = {
  path: string
}

const LearningLog = (props: Props) => {
  return (
    <>
      <AppHeader>
        <PageTitle title="Learning Log" />
      </AppHeader>
      <AppBody>
        <div>
          Coming soon: a record of your team's learnings & improvement ideas week over week.
        </div>
      </AppBody>
    </>
  )
}

export default LearningLog
