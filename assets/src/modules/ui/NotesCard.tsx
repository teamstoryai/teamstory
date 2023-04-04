import Button from '@/components/core/Button'
import Pressable from '@/components/core/Pressable'
import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'preact/hooks'

const NotesCard = (props: ModuleCardProps<any, string>) => {
  const [notes, setNotes] = useState('')
  const [privateNotes, setPrivateNotes] = useState('')
  const [showPrivateNotes, setShowPrivateNotes] = useState(false)

  const { data, error, loading, refresh } = useDataModule(props.module)

  return (
    <CardFrame title={props.title} {...{ count: data?.length, error, loading, refresh }}>
      <textarea
        class="w-full flex-1 rounded-md p-2 border-none bg-gray-100"
        placeholder="Enter team-visible notes here..."
        onChange={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
      >
        {notes}
      </textarea>
      {showPrivateNotes && (
        <>
          <div class="flex items-center my-2">
            <h2 class="text-lg font-semibold text-gray-800 flex-1">Private notes</h2>
            <Pressable className="text-gray-400" onClick={() => setShowPrivateNotes(false)}>
              <XMarkIcon class="w-4 h-4" />
            </Pressable>
          </div>
          <textarea
            class="w-full flex-1 rounded-md p-2 border-none bg-gray-100"
            placeholder="Enter private notes here..."
            onChange={(e) => setPrivateNotes((e.target as HTMLTextAreaElement).value)}
          ></textarea>
        </>
      )}
      <div class="flex justify-between items-center mt-2">
        {!showPrivateNotes && (
          <Pressable className="text-gray-400" onClick={() => setShowPrivateNotes(true)}>
            Add private notes
          </Pressable>
        )}
        <Button class="">Save</Button>
      </div>
    </CardFrame>
  )
}

export default NotesCard
