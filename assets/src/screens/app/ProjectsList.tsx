import Button from '@/components/core/Button'
import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'
import PageTitle from '@/components/layout/PageTitle'
import NewProjectModal from '@/components/modals/NewProjectModal'
import { paths } from '@/config'
import { Project } from '@/models'
import NoProjects from '@/screens/app/NoProjects'
import { modalStore } from '@/stores/modalStore'
import { projectStore } from '@/stores/projectStore'
import { classNames, mediumColorFor, pluralizeWithCount } from '@/utils'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useStore } from '@nanostores/preact'

type Props = {
  path: string
}
export default (props: Props) => {
  const projects = useStore(projectStore.projects)
  const activeProjects = useStore(projectStore.activeProjects)

  return (
    <>
      <AppHeader>
        <PageTitle title="Projects" />{' '}
      </AppHeader>

      <div className="px-4 sm:px-6 md:px-8">
        <div className="my-6 text-sm">
          Code & stories are organized into projects. Click on a project to view settings and invite
          collaborators.
        </div>
        <ProjectList projects={projects} />

        {activeProjects.length == 0 && (
          <>
            <div className="h-8" />
            <NoProjects />
          </>
        )}

        <div className="mt-10 text-center">
          <Button onClick={() => modalStore.newProjectModal.set(true)}>
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Project
          </Button>
        </div>
      </div>

      <NewProjectModal />
    </>
  )
}

type ProjectItem = Project & {
  href: string
  memberCount: number
  bgColor: string
}

function ProjectList({ projects }: { projects: Project[] }) {
  const projectItems: ProjectItem[] = projects.map((p, i) => ({
    ...p,
    href: paths.PROJECTS + '/' + p.id,
    memberCount: 1,
    bgColor: mediumColorFor(p.id),
  }))

  return (
    <div>
      <ul role="list" className="grid grid-cols-2 gap-5 sm:gap-6">
        {projectItems.map((project) => (
          <a href={project.href} key={project.id}>
            <li key={project.name} className="col-span-1 flex shadow-sm rounded-md">
              <div
                className={classNames(
                  'flex-shrink-0 flex items-center justify-center w-4 text-white text-sm font-medium rounded-l-md'
                )}
                style={{ background: project.bgColor }}
              />
              <div
                className="flex-1 flex items-center justify-between border-t border-r border-b
                 border-gray-200 bg-white rounded-r-md truncate hover:bg-gray-200"
              >
                <div className="flex-1 px-4 py-2 text-sm truncate">
                  <div
                    className={classNames(
                      project.archived_at ? 'text-gray-500' : 'text-gray-900',
                      'font-medium hover:text-gray-600'
                    )}
                  >
                    {project.name}
                    {project.id == 'fake' && ' (sample project)'}
                    {project.archived_at ? ' (archived)' : null}
                  </div>
                  <p className="text-gray-500">
                    {pluralizeWithCount('member', project.memberCount)}
                  </p>
                </div>
              </div>
            </li>
          </a>
        ))}
      </ul>
    </div>
  )
}
