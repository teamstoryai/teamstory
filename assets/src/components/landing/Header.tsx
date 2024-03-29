import Button from '@/components/core/Button'
import Logo from '@/components/core/Logo'
import LogoIcon from '@/components/core/LogoIcon'
import { hasToken, paths } from '@/config'

export default function () {
  const loggedIn = hasToken()
  return (
    <div
      className="flex justify-between items-center py-2
        px-6 md:justify-start md:space-x-10"
    >
      <div>
        <a href={paths.ROOT}>
          <Logo class="w-[150px]" />
        </a>
      </div>
      <div className="grow" />

      <div className="flex items-center md:ml-12">
        {loggedIn ? (
          <>
            <a href={paths.APP}>
              <Button>Go to app</Button>
            </a>
          </>
        ) : (
          <>
            <a
              href={paths.SIGNIN}
              className="text-base font-medium text-gray-500 hover:text-gray-900 mr-4"
            >
              Sign in
            </a>
            <a href={paths.SIGNUP}>
              <Button>Sign up</Button>
            </a>
          </>
        )}
      </div>
    </div>
  )
}
