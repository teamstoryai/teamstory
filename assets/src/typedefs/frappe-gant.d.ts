// from https://github.com/mohammed-io/frappe-gantt-react/tree/master
declare module 'frappe-gantt' {
  export declare class Task {
    id: string
    name: string
    start: string
    end: string
    constructor(options?: Partial<Task>)
    /**
     * Progress in percentage
     */
    progress: number
    /**
     * A css custom class for the task chart bar
     */
    custom_class?: string
    dependencies?: string
  }

  export type ViewMode = 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month'

  export type GanttOptions = {
    header_height?: number
    column_width?: number
    step?: number
    view_modes?: ViewMode[]
    bar_height?: number
    bar_corner_radius?: number
    arrow_curve?: number
    padding?: number
    view_mode?: ViewMode
    date_format?: string
    language?: string
    read_only?: boolean
    custom_popup_html?: (task: Task) => string
    on_click?: (task: Task) => void
    on_date_change?: (task: Task, start: Date, end: Date) => void
    on_progress_change?: (task: Task, progress: number) => void
    on_view_change?: (mode: ViewMode) => void
  }

  export default class Gantt {
    constructor(container: string | HTLMElement, tasks: Task[], options?: GanttOptions)

    refresh(tasks: Task[])
  }
}
