import BaseModule from '@/modules/data/BaseModule'
import { useCallback, useEffect, useState } from 'preact/hooks'

export type ModuleCardProps<Props, Output> = {
  title?: string
  module: BaseModule<Props, Output>
}

export default function useDataModule<Output>(
  module: BaseModule<any, Output>,
  dependencies?: any[]
) {
  const [data, setData] = useState<Output | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>()

  const loadData = (clearCache?: boolean) => {
    setLoading(true)
    module
      .fetchData(clearCache)
      .then((data) => {
        setData(data)
        setError(undefined)
      })
      .catch(setError)
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(loadData, dependencies || [])

  const refresh = useCallback(() => {
    loadData(true)
  }, [])

  return { data, loading, error, refresh }
}
