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
        show_today_highlight: false,
        show_saturday_highlight: true,
        show_sunday_highlight: true,
        start_date: props.module.props.startDate,
        end_date: props.module.props.endDate,
        date_padding: [7, 'day'],
        custom_popup_html: (task: Task) => {
          const title = task.name
          const subtitle = task.subtitle
          return `
            <div class="title">${title}</div>
            <div class="subtitle">${subtitle}</div>
          `
        },
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
