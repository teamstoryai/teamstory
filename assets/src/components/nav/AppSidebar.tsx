import { JSX } from 'preact'
import { Link } from 'preact-router'
import Match from 'preact-router/match'

import ProjectDropdown from '@/components/projects/ProjectDropdown'
import { paths } from '@/config'
import { projectStore } from '@/stores/projectStore'
import { classNames } from '@/utils'
import {
  CalendarDaysIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  HomeIcon,
  SparklesIcon,
  Squares2X2Icon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'
import icon_2weeks from '@/images/icon_2weeks.png'
import icon_quarter from '@/images/icon_quarter.png'

type NavItem = {
  name: string
  href: string
  icon?: (props: any) => JSX.Element
  indent?: number
}

export default ({ showHideButton }: { showHideButton?: boolean }) => {
  const projects = useStore(projectStore.activeProjects)

  const style = {
    background: '#fafafa',
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 select-none" style={style}>
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar">
        {!projects.length ? (
          <>
            <div />
          </>
        ) : (
          <>
            <ProjectDropdown />
            <Links />
          </>
        )}
      </div>
    </div>
  )
}

function Links() {
  let navigation = [
    { name: 'Dashboard', href: paths.DASHBOARD, icon: HomeIcon },
    { name: 'Learning Log', href: paths.LEARNING, icon: SparklesIcon },
    { name: 'Past 2 Weeks', href: paths.PAST_WEEKS, icon: ChevronDoubleLeftIcon },
    { name: 'Past Month', href: paths.PAST_MONTH, icon: CalendarDaysIcon },
    { name: 'Past Quarter', href: paths.PAST_QUARTER, icon: Squares2X2Icon },
    { name: 'Team Members', href: paths.TEAM, icon: UsersIcon },
    { name: 'Ask Tally', href: paths.ASK_TALLY, icon: ChatBubbleLeftEllipsisIcon },
  ] as NavItem[]

  return (
    <nav className="px-2 space-y-1">
      {navigation.map((item, i) => (
        <Match path={item.href} key={i}>
          {({ matches, url }: { matches: boolean; url: string }) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                url == item.href ? 'bg-blue-200 text-gray-900' : 'text-gray-700 hover:bg-blue-300',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}
              style={{ marginLeft: item.indent }}
            >
              {item.icon && (
                <item.icon
                  className={classNames(
                    url == item.href ? 'text-gray-700' : 'text-gray-800',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
              )}
              {item.name}
            </Link>
          )}
        </Match>
      ))}
    </nav>
  )
}
