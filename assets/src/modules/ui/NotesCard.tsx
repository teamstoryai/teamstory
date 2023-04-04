import { API } from '@/api'
import Button from '@/components/core/Button'
import Pressable from '@/components/core/Pressable'
import { config } from '@/config'
import useAutosizeTextArea from '@/hooks/useAutosizeTextArea'
import { Learning } from '@/models'
import NotesModule from '@/modules/data/NotesModule'
import CardFrame from '@/modules/ui/CardFrame'
import useDataModule, { ModuleCardProps } from '@/modules/ui/useDataModule'
import { projectStore } from '@/stores/projectStore'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

const NotesCard = (props: ModuleCardProps<any, Learning[]>) => {
  const notesRef = useRef<HTMLTextAreaElement | null>(null)
  const privateNotesRef = useRef<HTMLTextAreaElement | null>(null)
  const [notes, setNotes] = useState('')
  const [privateNotes, setPrivateNotes] = useState('')
  const [showPrivateNotes, setShowPrivateNotes] = useState(false)
  const [saving, setSaving] = useState(false)

  const { data, error, loading, refresh, setError } = useDataModule(props.module)

  useEffect(() => {
    if (data) {
      const publicNotes = data.find((d) => d.is_you && !d.private)
      const privateNotes = data.find((d) => d.is_you && d.private)
      if (publicNotes) setNotes(publicNotes.content)
      if (privateNotes && privateNotes.content) {
        setPrivateNotes(privateNotes.content)
        setShowPrivateNotes(true)
      }
    }
  }, [data])

  useAutosizeTextArea(notesRef.current, notes)
  useAutosizeTextArea(privateNotesRef.current, privateNotes)

  const hidePrivateNotes = useCallback(() => {
    if (privateNotes) {
      if (!confirm('Discard private notes?')) return
    }
    setShowPrivateNotes(false)
    setPrivateNotes('')
    ;(props.module as NotesModule).saveNotes(notes, '')
  }, [privateNotes])

  const save = () => {
    setSaving(true)
    ;(props.module as NotesModule)
      .saveNotes(notes, privateNotes)
      .catch(setError)
      .finally(() => setSaving(false))
  }

  return (
    <CardFrame
      title={props.title}
      {...{ error, loading, refresh: config.dev ? refresh : undefined }}
    >
      <textarea
        ref={notesRef}
        class="w-full flex-grow rounded-md p-2 border-none bg-gray-100"
        placeholder="Enter team-visible notes here..."
        onChange={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
      >
        {notes}
      </textarea>
      {showPrivateNotes && (
        <>
          <div class="flex items-center my-2">
            <h2 class="text-lg font-semibold text-gray-800 flex-1">Private notes</h2>
            <Pressable className="text-gray-400" onClick={() => hidePrivateNotes()}>
              <XMarkIcon class="w-4 h-4" />
            </Pressable>
          </div>
          <textarea
            ref={privateNotesRef}
            class="w-full h-[40px] rounded-md p-2 border-none bg-gray-100"
            placeholder="Enter private notes here..."
            onChange={(e) => setPrivateNotes((e.target as HTMLTextAreaElement).value)}
          >
            {privateNotes}
          </textarea>
        </>
      )}
      <div class="flex justify-between items-center mt-2">
        {!showPrivateNotes && (
          <Pressable className="text-gray-400" onClick={() => setShowPrivateNotes(true)}>
            Add private notes
          </Pressable>
        )}
        <Button onClick={save} class="" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </CardFrame>
  )
}

export default NotesCard
