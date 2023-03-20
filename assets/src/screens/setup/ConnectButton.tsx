import useTippy from '@/hooks/useTippy'
import { RenderableProps } from 'preact'
import { useRef } from 'preact/hooks'

export type ConnectProps = {
  onClick?: () => void
  disabled?: boolean
  comingSoon?: boolean
  icon: string
  text: string
}

export const ConnectButton = (props: RenderableProps<ConnectProps>) => {
  const ref = useRef<HTMLButtonElement>(null)

  useTippy(ref, props.comingSoon ? 'Coming Soon' : 'Connect')

  return (
    <button
      ref={ref}
      onClick={props.onClick}
      disabled={props.disabled}
      class="flex items-center bg-gray-200 hover:bg-gray-300 border border-gray-300 shadow-sm rounded-md px-4 py-2"
    >
      <img src={props.icon} class="h-6 w-6" />
      <span class="ml-2">{props.text}</span>
    </button>
  )
}
