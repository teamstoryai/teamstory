import DataModule from '@/modules/ModuleCard'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'

export type StatsModuleProps = {
  title: string
}

const StatsModule = (props: StatsModuleProps) => {
  return (
    <DataModule title={props.title}>
      <div class="py-2">
        <dt class="text-base font-normal text-gray-900">Features shipped</dt>
        <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div class="flex items-baseline text-2xl font-semibold text-indigo-600">
            21
            <span class="ml-2 text-sm font-medium text-gray-500">from 18</span>
          </div>

          <div class="inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium bg-green-100 text-green-800 md:mt-2 lg:mt-0">
            <ArrowUpIcon class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500" />
            <span class="sr-only"> Increased by </span>
            17%
          </div>
        </dd>
      </div>

      <div class="py-2">
        <dt class="text-base font-normal text-gray-900">Bugs fixed</dt>
        <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div class="flex items-baseline text-2xl font-semibold text-indigo-600">
            10
            <span class="ml-2 text-sm font-medium text-gray-500">from 14</span>
          </div>

          <div class="inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium bg-red-100 text-red-800 md:mt-2 lg:mt-0">
            <ArrowDownIcon class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500" />
            <span class="sr-only"> Decreased by </span>
            28%
          </div>
        </dd>
      </div>

      <div class="py-2">
        <dt class="text-base font-normal text-gray-900">New bugs found</dt>
        <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div class="flex items-baseline text-2xl font-semibold text-indigo-600">
            4<span class="ml-2 text-sm font-medium text-gray-500">from 6</span>
          </div>

          <div class="inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium bg-green-100 text-green-800 md:mt-2 lg:mt-0">
            <ArrowDownIcon class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500" />
            <span class="sr-only"> Decreased by </span>
            33%
          </div>
        </dd>
      </div>
    </DataModule>
  )
}

export default StatsModule
