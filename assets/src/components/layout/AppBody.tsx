import { RenderableProps } from 'preact'
import { twMerge } from 'tailwind-merge'

export default (props: RenderableProps<{ class?: string }>) => (
  <div class={twMerge('flex flex-col grow w-full px-6 mt-4 mx-2', props.class || '')}>
    {props.children}
  </div>
)
