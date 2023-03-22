import DataModule from '@/modules/DataModule'
import github, { PullRequest } from '@/query/github'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { useStore } from '@nanostores/preact'
import { useEffect, useState } from 'preact/hooks'

type Props = {
  title: string
  query: string
}

const IssuesModule = (props: Props) => {
  const [error, setError] = useState('')
  const fetchData = (clear?: boolean) => {}

  useEffect(() => {
    fetchData()
  }, [props.query])

  const refresh = () => fetchData(true)

  return (
    <DataModule title={props.title} refresh={refresh} error={error}>
      <div class="flex flex-col w-full gap-2"></div>
    </DataModule>
  )
}

export default IssuesModule
