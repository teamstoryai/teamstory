import GoogleServerOAuth, {
  CALENDAR_SCOPES,
  GoogleResponse,
  PROFILE_SCOPES,
} from '@/components/auth/GoogleServerOAuth'
import Helmet from '@/components/core/Helmet'
import Pressable from '@/components/core/Pressable'
import AppHeader from '@/components/layout/AppHeader'
import PageTitle from '@/components/layout/PageTitle'
import { OAuthToken } from '@/models'
import { authStore } from '@/stores/authStore'
import { calendarStore } from '@/stores/calendarStore'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'

export default (props: { path: string }) => {
  const user = useStore(authStore.loggedInUser)

  return (
    <>
      <Helmet title={`Settings`} />
      <AppHeader>
        <PageTitle title="Settings" />
      </AppHeader>

      <div className="flex flex-col grow w-full px-6 mt-4 mx-2">
        <div class="flex flex-col gap-6">
          <TimeZoneSetting />
          {/* <CalendarSettings /> */}
          <LogOut />
        </div>
      </div>
    </>
  )
}

declare global {
  namespace Intl {
    function supportedValuesOf(type: string): string[]
  }
}

function TimeZoneSetting() {
  const user = useStore(authStore.loggedInUser)

  const tzs: string[] = Intl.supportedValuesOf('timeZone')
  const selected = user?.timezone || ''

  const onChange = (newValue: string) => authStore.updateUser({ timezone: newValue })

  return (
    <div>
      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
        Timezone
      </label>
      <select
        id="timezone"
        name="timezone"
        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        value={selected}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
      >
        {tzs.map((tz) => (
          <option>{tz}</option>
        ))}
      </select>
    </div>
  )
}

function CalendarSettings() {
  const tokens = useStore(calendarStore.tokens)

  const onConnect = async (response: GoogleResponse) => {
    await calendarStore.saveGoogleOAuthToken(response)
  }

  const deleteToken = (token: OAuthToken) => () => {
    if (!confirm('Disconnect ' + token.email + '?')) return
    calendarStore.disconnectAccount(token.email!)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Calendars</label>
      {tokens?.map((token) => (
        <div class="flex items-center my-2 gap-4">
          {token.email}
          <Pressable onClick={deleteToken(token)}>
            <TrashIcon class="w-6 h-6" />
          </Pressable>
        </div>
      ))}
      <GoogleServerOAuth
        desc="Add Calendar"
        scope={[...PROFILE_SCOPES, ...CALENDAR_SCOPES]}
        onSuccess={onConnect}
        skipToken
      />
    </div>
  )
}

function LogOut() {
  const user = useStore(authStore.loggedInUser)
  return (
    <div className="my-2">
      <Pressable
        className="text-red-500 py-3 text-center"
        onClick={() => confirm('Log out?') && authStore.logout()}
      >
        Log Out ({user?.email})
      </Pressable>
    </div>
  )
}
