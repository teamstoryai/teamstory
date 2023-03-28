import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import AppBody from '@/components/layout/AppBody'
import PageTitle from '@/components/layout/PageTitle'

type Props = {
  path: string
}

const AskTally = (props: Props) => {
  return (
    <>
      <AppHeader>
        <PageTitle title="Ask Tally" />
      </AppHeader>
      <AppBody>
        <div>Coming soon: get help about anything that's going on with your team.</div>
      </AppBody>
    </>
  )
}

export default AskTally
