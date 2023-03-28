import Helmet from '@/components/core/Helmet'
import { RenderableProps } from 'preact'

const PageTitle = (props: RenderableProps<{ title: string }>) => (
  <div class="mt-2 md:flex md:items-center md:justify-between">
    <Helmet title={props.title} />
    <div class="min-w-0 flex-1">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {props.title}
      </h2>
    </div>
    {props.children}
  </div>
)

export default PageTitle

/* example children:
<div class="mt-4 flex flex-shrink-0 md:mt-0 md:ml-4">
  <button type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Edit</button>
  <button type="button" class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Publish</button>
</div>
*/
