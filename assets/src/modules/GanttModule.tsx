import DataModule from '@/modules/ModuleCard'

import Gantt from 'frappe-gantt'
import { useEffect, useRef } from 'preact/hooks'

export type GanttModuleProps = {
  title: string
  viewMode?: 'Day' | 'Week' | 'Month'
}

const GanttModule = (props: GanttModuleProps) => {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return
    const tasks = [
      {
        id: 'Task 1',
        name: 'Redesign website',
        start: '2016-12-28',
        end: '2016-12-31',
        progress: 20,
        dependencies: 'Task 2, Task 3',
        custom_class: 'bar-milestone', // optional
      },
    ]
    const gantt = new Gantt(divRef.current, tasks, {
      view_mode: props.viewMode || 'Day',
      read_only: true,
    })
  }, [divRef.current])

  return (
    <DataModule title={props.title} className="lg:col-span-2">
      <div ref={divRef}></div>
    </DataModule>
  )
}

export default GanttModule
