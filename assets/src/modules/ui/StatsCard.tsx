import { STATS_NO_LABEL, Stat } from '@/modules/data/StatsModule'
import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'
import { toTitleCase } from '@/utils'
import { ArrowDownIcon, ArrowUpIcon, Bars2Icon } from '@heroicons/react/24/outline'

const StatsCard = (props: ModuleCardProps<any, Stat[]>) => {
  const { data, error, loading } = useDataModule(props.module)

  return (
    <CardFrame title={props.title} {...{ count: data?.length, error, loading }}>
      {data?.map((stat, i) => (
        <div class="py-2" key={i}>
          <dt class="text-base font-normal text-gray-900">
            {stat.label == STATS_NO_LABEL
              ? data.length > 1
                ? 'Other Issues'
                : 'Issues'
              : toTitleCase(stat.label) + 's'}
          </dt>
          <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div class="flex items-baseline text-2xl font-semibold text-indigo-600">
              {stat.count}
              {stat.prev ? (
                <span class="ml-2 text-sm font-medium text-gray-500">from {stat.prev}</span>
              ) : null}
            </div>

            <div
              class={
                `inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0 ` +
                `bg-${stat.color}-100 text-${stat.color}-800`
              }
              title={'Previous period: ' + stat.prev}
            >
              {stat.count < stat.prev ? (
                <ArrowDownIcon class="h-4 w-4" />
              ) : stat.count > stat.prev ? (
                <ArrowUpIcon class="h-4 w-4" />
              ) : (
                <Bars2Icon class="h-4 w-4" />
              )}
            </div>
          </dd>
        </div>
      ))}
    </CardFrame>
  )
}

export default StatsCard
