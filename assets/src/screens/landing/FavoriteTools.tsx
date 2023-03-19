import github from '@/images/github.png'
import gitlab from '@/images/gitlab.png'
import linear from '@/images/linear.png'
import jira from '@/images/jira.png'

export default function FavoriteTools() {
  return (
    <div className="relative overflow-hidden py-16">
      <div className="relative md:px-6">
        <div className="mx-auto max-w-prose text-lg p-8 sm:p-12">
          <h1>
            <span className="mt-2 block text-center text-2xl font-bold leading-8 tracking-tight text-slate-800 sm:text-3xl">
              Works with your favorite tools
            </span>
          </h1>
          <div className="mt-8 flex gap-8 flex-wrap justify-center">
            <img alt="Github" src={github} className="inline-block w-12 h-12" />
            <img alt="Gitlab" src={gitlab} className="inline-block w-12 h-12" />
            <img alt="Linear" src={linear} className="inline-block w-12 h-12" />
            <img alt="Jira" src={jira} className="inline-block w-12 h-12" />
          </div>
        </div>
      </div>
    </div>
  )
}
