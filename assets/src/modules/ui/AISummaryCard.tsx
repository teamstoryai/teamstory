import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'

const AISummaryCard = (props: ModuleCardProps<any, string>) => {
  const { data, error, loading, refresh } = useDataModule(props.module)

  const dataLines = data?.split('\n') || []

  return (
    <CardFrame className="lg:col-span-2" title={props.title} {...{ error, loading, refresh }}>
      <ul class="list-disc ml-5">
        {dataLines.map((line, i) => {
          const trimmedLine = line.replace(/^- /, '')
          const [name, text] = trimmedLine.split(': ', 2)

          return (
            <li class="list-item text-gray-800" key={i}>
              {text ? <span class="font-semibold">{name}:</span> : null}
              {text ? <span class="ml-1">{text}</span> : <span class="ml-1">{name}</span>}
            </li>
          )
        })}
      </ul>
    </CardFrame>
  )
}
export default AISummaryCard
