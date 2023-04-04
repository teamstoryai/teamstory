import Pressable from '@/components/core/Pressable'
import useTippy from '@/hooks/useTippy'
import { UserTimeline } from '@/modules/data/TeamCurrentModule'
import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'
import { connectStore, ProjectUserInfo, ProjectUserMap } from '@/stores/connectStore'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'
import { formatDistance } from 'date-fns'
import { StateUpdater, useRef, useState } from 'preact/hooks'

const TeamCurrentCard = (props: ModuleCardProps<any, UserTimeline[]>) => {
  const [selected, setSelected] = useState<string[]>([])
  const userInfos = useStore(connectStore.users)
  const { data, error, loading } = useDataModule(props.module, [userInfos])

  const merge = () => {
    let change: ProjectUserInfo = {}
    let changeId = selected[0]
    for (const id of selected) {
      if (userInfos[id]) {
        changeId = id
        change = userInfos[id]
      }
    }
    if (!change) change = {}
    if (!change.aliases) change.aliases = selected
    else change.aliases = Array.from(new Set([...change.aliases, ...selected]))
    change.aliases = change.aliases.filter((a) => a != changeId)

    // pick the longer of the two names
    const names = data!.filter((t) => selected.includes(t.user.id)).map((t) => t.user.name)
    change.name = names.reduce((a, b) => (a.length > b.length ? a : b))

    connectStore.updateUsers({ [changeId]: change })
    setSelected([])
  }

  const unmerge = () => {
    const id = selected[0]
    const change = { ...userInfos[id], aliases: [] }

    connectStore.updateUsers({ [id]: change })
    setSelected([])
  }

  const hide = () => {
    let changes: ProjectUserMap = {}
    for (const id of selected) {
      if (userInfos[id]) {
        changes[id] = { ...userInfos[id], hidden: true }
      } else {
        changes[id] = { hidden: true }
      }
    }
    connectStore.updateUsers(changes)
    setSelected([])
  }

  const rename = () => {
    let changes: ProjectUserMap = {}
    const id = selected[0]
    const existing = data!.find((t) => t.user.id == selected[0])
    const name = prompt('New name for user:', userInfos[id]?.name || existing?.user.name)
    if (!name) return
    if (userInfos[id]) {
      changes[id] = { ...userInfos[id], name }
    } else {
      changes[id] = { name }
    }
    connectStore.updateUsers(changes)
    setSelected([])
  }

  const itemsPerRow = data ? Math.max(Math.min(10, 40 / data.length), 4) : 0

  return (
    <CardFrame className="lg:col-span-2" title={props.title} {...{ error, loading }}>
      <div class="-ml-1 text-sm flex gap-2">
        {selected.length > 1 && (
          <Pressable className="inline-block text-blue-600 mb-4" onClick={merge}>
            Merge users
          </Pressable>
        )}
        {selected.length == 1 && userInfos[selected[0]]?.aliases && (
          <Pressable className="inline-block text-blue-600 mb-4" onClick={unmerge}>
            Un-merge users
          </Pressable>
        )}
        {selected.length > 0 && (
          <Pressable className="inline-block text-blue-600 mb-4" onClick={hide}>
            Hide user{selected.length > 1 ? 's' : ''}
          </Pressable>
        )}
        {selected.length == 1 && (
          <Pressable className="inline-block text-blue-600 mb-4" onClick={rename}>
            Rename
          </Pressable>
        )}
      </div>
      <div className="grid grid-cols-4 -mx-4 -mb-4 overflow-y-auto">
        {data?.map((timeline) => (
          <UserRow
            key={timeline.user.id}
            data={timeline}
            selected={selected.indexOf(timeline.user.id) > -1}
            setSelected={setSelected}
            itemsPerRow={itemsPerRow}
          />
        ))}
      </div>
    </CardFrame>
  )
}

function UserRow({
  data,
  selected,
  setSelected,
  itemsPerRow,
}: {
  data: UserTimeline
  selected: boolean
  setSelected: StateUpdater<string[]>
  itemsPerRow: number
}) {
  const divRef = useRef<HTMLDivElement | null>(null)
  const today = new Date()
  const select = () => {
    if (selected) setSelected((selected) => selected.filter((id) => id !== data.user.id))
    else setSelected((selected) => [...selected, data.user.id])
  }

  useTippy(divRef, { content: 'Click on avatar for actions' })

  return (
    <>
      <div className="flex items-center p-4 pr-2 border-t border-gray-200">
        <div className="mr-2 relative" ref={divRef}>
          <img
            className="h-12 w-12 rounded-full"
            src={
              data.user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}`
            }
            alt=""
          />
          <div
            onClick={select}
            className={`absolute rounded-full top-0 left-0 w-full h-full hover:bg-gray-800/50
              cursor-pointer ${selected ? 'bg-gray-800/80' : ''}`}
            title="Merge"
          >
            {selected && <CheckIcon class="ml-2 mt-2 h-8 w-8 text-green-500" />}
          </div>
        </div>
        <div class="flex-1 truncate">
          <p className="text-sm font-medium text-indigo-600">{data.user.name}</p>
          <p className="mt-2 flex items-center text-sm text-gray-500">{data.user.email}</p>
        </div>
      </div>
      <div class="text-sm text-gray-800 col-span-3 p-4 pl-2 border-t border-gray-200">
        {data.timeline.slice(0, itemsPerRow).map((event) => (
          <a href={event.url} target="_blank" className="flex items-center hover:underline">
            <span class="flex-1 truncate">{event.message}</span>
            <span className="ml-2 text-gray-500 text-xs">
              {formatDistance(new Date(event.ts), today, { addSuffix: true })}
            </span>
          </a>
        ))}
      </div>
    </>
  )
}

export default TeamCurrentCard
