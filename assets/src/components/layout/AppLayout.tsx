import { format } from 'date-fns'
import { RenderableProps } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Toaster } from 'react-hot-toast'
import uniqolor from 'uniqolor'

import AppSidebar from '@/components/nav/AppSidebar'
import { SidebarMenu } from '@/components/nav/SidebarMenu'
import useSwipe from '@/hooks/useSwipe'
import { uiStore } from '@/stores/uiStore'
import { classNames, ctrlOrCommand } from '@/utils'
import { useStore } from '@nanostores/preact'

export default function ({ children }: RenderableProps<{}>) {
  const sidebarMenuOpen = useStore(uiStore.sidebarMenuOpen)
  const sidebarHidden = useStore(uiStore.sidebarHidden)

  const setSidebarOpen = (state: boolean) => uiStore.sidebarMenuOpen.set(state)

  useEffect(() => {
    if (sidebarMenuOpen) {
      // TODO close sidebar menu?
    }
  }, [sidebarMenuOpen])

  useSwipe((dir) => {
    setSidebarOpen(dir == 'right')
  })

  // generate two random colors from today's date
  const date = useStore(uiStore.calendarDate)
  const gradientColor1 = uniqolor(format(date, 'd MMMM EEEE'), { lightness: [85, 97] }).color
  const gradientColor2 = uniqolor(format(date, 'EEEE M<MM d'), { lightness: [85, 97] }).color

  const style = {
    background: `linear-gradient(320deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
  }

  return (
    <div class="w-full h-full min-w-[300px]" style={style}>
      <Toaster />
      <SidebarMenu />
      {!sidebarHidden && (
        <div className="hidden md:flex md:w-52 xl:w-72 md:flex-col md:fixed md:inset-y-0 relative">
          <AppSidebar showHideButton />
        </div>
      )}

      <div
        className={classNames(
          !sidebarHidden ? 'md:ml-52 xl:ml-72' : '',
          'flex flex-col min-h-full print:h-auto bg-gray-50'
        )}
      >
        <div className="flex-1 flex">
          <main className="flex flex-1 flex-col mt-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </div>
  )
}

export type SidebarProps = {
  sidebarOpen: boolean
  desktopSidebarHidden: boolean
  setDesktopSidebarHidden: (s: boolean) => void
  setSidebarOpen: (s: boolean) => void
}
