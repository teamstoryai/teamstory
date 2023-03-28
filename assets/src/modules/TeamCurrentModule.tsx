import DataModule from '@/modules/ModuleCard'
import github from '@/query/github'
import { IssueFilters } from '@/query/linear'
import { QueryPullRequest } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'
import { formatDistance } from 'date-fns'
import { useEffect, useState } from 'preact/hooks'

export type TeamCurrentModuleProps = {
  title: string
  openPulls: string
  mergedPulls: string
  openIssues: IssueFilters
}

const TeamCurrentModule = (props: TeamCurrentModuleProps) => {
  const [error, setError] = useState('')

  return (
    <DataModule title={props.title} className="lg:col-span-2" error={error}>
      <div class="flex flex-col w-full gap-2">Bob</div>
    </DataModule>
  )
}

export default TeamCurrentModule
