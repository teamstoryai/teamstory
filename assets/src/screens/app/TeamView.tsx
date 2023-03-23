import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import AppBody from '@/components/layout/AppBody'

type Props = {
  path: string
}

const TeamView = (props: Props) => {
  return (
    <>
      <Helmet title={'Team'} />

      <AppHeader>
        <div class="flex flex-1 gap-2 items-center relative overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis">
            Team
          </h1>
        </div>
      </AppHeader>
      <AppBody>
        <div>Please check back later.</div>
      </AppBody>
    </>
  )
}

export default TeamView
