import { RefObject } from 'preact'
import { useEffect } from 'preact/hooks'
import tippy, { Props as TippyProps } from 'tippy.js'

export type TooltipProps = TippyProps

export default function useTippy(ref: RefObject<HTMLElement>, opts: string | Partial<TippyProps>) {
  useEffect(() => {
    if (!ref.current) return

    const options = typeof opts === 'string' ? { content: opts } : opts
    const tippyInstance = tippy(ref.current, {
      ...options,
      onMount(instance) {
        if (options.onMount) options.onMount(instance)
        instance.popperInstance?.update()
      },
    })

    return () => {
      tippyInstance.destroy()
    }
  }, [ref.current])
}
