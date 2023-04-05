import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'

const AISummaryCard = (props: ModuleCardProps<any, string>) => {
  const { data, error, loading, refresh } = useDataModule(props.module)

  const dataLines = data?.split('\n').filter(Boolean) || []
  const listStyle = data?.startsWith('- ')
    ? 'list-disc'
    : data?.startsWith('1.')
    ? 'list-decimal'
    : 'list-none'

  const splitter =
    dataLines.filter((d) => d.indexOf(': ') > -1).length == dataLines.length
      ? ': '
      : dataLines.filter((d) => d.indexOf(', ') > -1).length == dataLines.length
      ? ', '
      : dataLines.filter((d) => d.indexOf('. ') > -1).length == dataLines.length
      ? '. '
      : null

  return (
    <CardFrame className="lg:col-span-2" title={props.title} {...{ error, loading, refresh }}>
      <ul class={`${listStyle} ml-5`}>
        {dataLines.map((line, i) => {
          const trimmedLine = line.replace(/^(-|\d+.) /, '').trim()

          const listSplit = splitter ? trimmedLine.indexOf(splitter) : null
          const [boldPart, textPart] = listSplit
            ? [trimmedLine.substring(0, listSplit), trimmedLine.substring(listSplit)]
            : ['', trimmedLine]
          const style = trimmedLine.length > 0 ? 'list-item' : 'list-none'

          return (
            <li class={`${style} text-gray-800`} key={i}>
              {boldPart ? <span class="font-semibold">{boldPart}</span> : null}
              {boldPart ? <span>{textPart}</span> : <span>{textPart}</span>}
            </li>
          )
        })}
      </ul>
    </CardFrame>
  )
}
export default AISummaryCard
