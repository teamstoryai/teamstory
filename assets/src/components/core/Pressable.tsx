import { RenderableProps } from 'preact'
import { twMerge } from 'tailwind-merge'

import { useRef } from 'preact/hooks'
import useTippy, { TooltipProps } from '@/hooks/useTippy'

export default ({
  tooltip,
  className,
  onClick,
  children,
}: RenderableProps<{
  className?: string
  tooltip?: string | TooltipProps
  onClick: (e: MouseEvent) => void
}>) => {
  const ref = useRef<HTMLDivElement>(null)

  if (tooltip) {
    useTippy(ref, tooltip)
  }

  return (
    <div
      ref={ref}
      className={twMerge(
        'relative flex flex-col items-center group p-1 rounded cursor-pointer print:hidden hover:bg-gray-400/50',
        className || ''
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
