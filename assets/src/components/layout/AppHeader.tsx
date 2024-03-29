import { RenderableProps } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { twMerge } from 'tailwind-merge'

import CalendarToggle from '@/components/calendar/CalendarToggle'
import UserMenu from '@/components/nav/UserMenu'
import { uiStore } from '@/stores/uiStore'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'

type Props = {
  transparent?: boolean
}

export default function AppHeader(p: RenderableProps<Props>) {
  const sidebarOpen = useStore(uiStore.sidebarMenuOpen)
  const sidebarHidden = useStore(uiStore.sidebarHidden)

  const [hasShadow, setHasShadow] = useState(false)

  useEffect(() => {
    const listener = () => {
      if (hasShadow && window.scrollY == 0) setHasShadow(false)
      else if (!hasShadow && window.scrollY > 0) setHasShadow(true)
    }
    window.addEventListener('scroll', listener)
    return () => window.removeEventListener('scroll', listener)
  }, [hasShadow])

  return (
    <div
      className={twMerge(
        'sticky top-0 py-2 z-20 flex-shrink-0 flex min-h-[40px]',
        'border-b max-w-[100vw]',
        p.transparent ? 'bg-transparent' : 'bg-gray-50',
        hasShadow ? 'py-2' : 'border-transparent'
      )}
    >
      {(!sidebarOpen || sidebarHidden) && (
        <button
          type="button"
          className="px-4 border-gray-200 text-gray-500 focus:outline-none -my-1
        focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden hover:bg-gray-100"
          style={{ display: sidebarHidden ? 'block' : undefined }}
          onClick={(e) =>
            sidebarHidden ? uiStore.sidebarHidden.set(false) : uiStore.sidebarMenuOpen.set(true)
          }
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      <div class="w-8" />

      <div className="flex-1 flex justify-between select-none pt-1 overflow-hidden">
        {p.children}
      </div>
      <div className="mr-4 flex items-center mt-2 md:mr-8">
        <UserMenu />
      </div>
    </div>
  )
}
