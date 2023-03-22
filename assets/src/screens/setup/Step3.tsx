import { useEffect, useState } from 'preact/hooks'
import { logger } from '@/utils'
import { API } from '@/api'
import Submit from '@/components/core/Submit'

export const Step3 = () => {
  const [whatsImportant, setWhatsImportant] = useState('')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    API.getUserData('setup').then((data) => {
      setWhatsImportant(data.whatsImportant || '')
    })
  }, [])

  const onSubmit = async (e: Event) => {
    e.preventDefault()
    setSaveState('saving')
    API.setUserData('setup', { whatsImportant })
      .then((e) => setSaveState('saved'))
      .catch((e) => {
        logger.error(e)
        setSaveState('error')
      })
  }

  const saveLabel =
    saveState === 'saving'
      ? 'Saving...'
      : saveState == 'saved'
      ? 'Saved'
      : saveState == 'error'
      ? 'Error Saving'
      : 'Save'

  return (
    <div class="mb-12">
      <h1 class="text-lg my-2">3. Onboarding</h1>

      <p class="text-gray-700">
        Awesome! We will contact you when your dashboard is ready. If you have some time, please
        tell us what you're hoping for in a team dashboard:
      </p>

      <form onSubmit={onSubmit} class="mt-2 max-w-lg">
        <textarea
          placeholder="What's important to you?"
          value={whatsImportant}
          onChange={(e) => setWhatsImportant((e.target as HTMLTextAreaElement).value)}
          class="w-full border border-gray-300 rounded-md p-2 my-2"
        />

        <Submit disabled={saveState == 'saving'} label={saveLabel} />
      </form>

      <p class="text-gray-700 my-2">
        If it's been a few days, please reach out to{' '}
        <a href="mailto:support@teamstory.ai" class="text-blue-700 hover:underline">
          support@teamstory.ai
        </a>
        .
      </p>
    </div>
  )
}
