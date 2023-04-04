import Gantt, { Task } from '@/gantt'
import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'
import { MutableRef, useEffect, useRef } from 'preact/hooks'

const GanttCard = (props: ModuleCardProps<any, Task[]>) => {
  const { data, error, loading, refresh } = useDataModule(props.module)
  const divRef = useRef<HTMLDivElement>(null)
  const gantt: MutableRef<Gantt | null> = useRef<Gantt | null>(null)

  useEffect(() => {
    if (!data) return
    if (!gantt.current) {
      gantt.current = new Gantt(divRef.current, data, {
        view_mode: props.module.props.viewMode || 'Day',
        read_only: true,
        popup_trigger: 'mouseover',
        footer_padding: 0,
      })
    } else {
      gantt.current.refresh(data)
    }
  }, [data])

  return (
    <CardFrame
      title={props.title}
      className="lg:col-span-2"
      {...{ count: data?.length, error, loading, refresh }}
    >
      <div ref={divRef}></div>
    </CardFrame>
  )
}

export default GanttCard
