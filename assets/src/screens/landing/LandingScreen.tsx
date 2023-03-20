import LandingLayout from '@/components/layout/LandingLayout'
import { hasToken, paths } from '@/config'
import Hero from '@/screens/landing/Hero'
import FavoriteTools from '@/screens/landing/FavoriteTools'

type Props = {
  path: string
}

export default (props: Props) => {
  if (hasToken() && location.search != '?stay') {
    location.href = paths.APP
  }

  return (
    <LandingLayout darkFooter>
      <main className="flex flex-col grow ">
        <Hero />

        <FavoriteTools />
      </main>
    </LandingLayout>
  )
}
