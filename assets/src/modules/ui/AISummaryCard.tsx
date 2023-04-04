import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'

const AISummaryCard = (props: ModuleCardProps<any, string>) => {
  const { data, error, loading, refresh } = useDataModule(props.module)

  return (
    <CardFrame className="lg:col-span-2" title={props.title} {...{ error, loading, refresh }}>
      <p class="whitespace-pre-wrap">{data}</p>
    </CardFrame>
  )
}
export default AISummaryCard
