import { JSX } from 'preact'
import { Link } from 'preact-router'
import Match from 'preact-router/match'

import ProjectDropdown from '@/components/projects/ProjectDropdown'
import { paths } from '@/config'
import { projectStore } from '@/stores/projectStore'
import { classNames } from '@/utils'
import {
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDoubleLeftIcon,
  HomeIcon,
  SparklesIcon,
  Squares2X2Icon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'
import { Project } from '@/models'

type NavItem = {
  name: string
  href: string
  icon?: (props: any) => JSX.Element
  indent?: number
}

const AppSidebar = ({ showHideButton }: { showHideButton?: boolean }) => {
  const projects = useStore(projectStore.activeProjects)
  const currentProject = useStore(projectStore.currentProject)

  const needsSetup = !Project.meta(currentProject).ob

  return (
    <div className="flex-1 flex flex-col min-h-0 select-none bg-gray-50">
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar">
        {!projects.length ? (
          <>
            <div class="h-3" />
            <Links items={[{ name: 'Welcome!', href: paths.PROJECTS, icon: SparklesIcon }]} />
          </>
        ) : needsSetup ? (
          <>
            <div class="h-3" />
            <Links items={[{ name: 'Project Setup', href: paths.SETUP, icon: SparklesIcon }]} />
          </>
        ) : (
          <>
            <ProjectDropdown />
            <Links items={mainNav} />
          </>
        )}
      </div>
    </div>
  )
}

const mainNav = [
  { name: 'Dashboard', href: paths.DASHBOARD, icon: HomeIcon },
  { name: 'Learning Log', href: paths.LEARNING, icon: SparklesIcon },
  { name: 'Past 2 Weeks', href: paths.PAST_WEEKS, icon: ChevronDoubleLeftIcon },
  { name: 'Past Month', href: paths.PAST_MONTH, icon: CalendarDaysIcon },
  { name: 'Past Quarter', href: paths.PAST_QUARTER, icon: Squares2X2Icon },
  { name: 'Team Members', href: paths.TEAM, icon: UsersIcon },
  { name: 'Ask Tally', href: paths.ASK_TALLY, icon: ChatBubbleLeftEllipsisIcon },
] as NavItem[]

function Links({ items }: { items: NavItem[] }) {
  return (
    <nav className="px-2 space-y-1">
      {items.map((item, i) => (
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

export default AppSidebar
