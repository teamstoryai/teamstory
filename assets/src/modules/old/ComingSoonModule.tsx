import DataModule from '@/modules/ui/CardFrame'
import { useState } from 'preact/hooks'

export type ComingSoonModuleProps = {
  title: string
}

const ComingSoonModule = (props: ComingSoonModuleProps) => {
  const [error, setError] = useState('')

  return (
    <DataModule title={props.title} className="lg:col-span-2" error={error}>
      <div class="flex flex-col w-full gap-2">Answers to this question are coming soon...</div>
    </DataModule>
  )
}

export default ComingSoonModule
