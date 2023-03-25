import { useEffect, useState } from 'preact/hooks'
import { logger } from '@/utils'
import { API } from '@/api'
import Submit from '@/components/core/Submit'
import { projectStore } from '@/stores/projectStore'
import { Project } from '@/models'
import { route } from 'preact-router'
import { paths } from '@/config'
import { uiStore } from '@/stores/uiStore'

export const Step3 = () => {
  const [whatsImportant, setWhatsImportant] = useState('')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    API.getUserData('setup').then((data) => {
      if (data) setWhatsImportant(data.whatsImportant || '')
    })
  }, [])

  const onSubmit = async (e: Event) => {
    e.preventDefault()
    setSaveState('saving')
    API.setUserData('setup', { whatsImportant })
      .then(async (e) => {
        const project = projectStore.currentProject.get()
        if (project && !Project.meta(project).ob) {
          await projectStore.updateProject(project, { meta: { ob: 1 } })
        }
        setSaveState('saved')
        uiStore.loadTokens()
        route(paths.DASHBOARD)
      })
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
      : 'Next'

  return (
    <div class="mb-12">
      <h1 class="text-lg my-2">3. Onboarding</h1>

      <p class="text-gray-700">Please tell us what you're hoping for in using Teamstory:</p>

      <form onSubmit={onSubmit} class="mt-2 max-w-lg">
        <textarea
          placeholder="What's important to you?"
          value={whatsImportant}
          onChange={(e) => setWhatsImportant((e.target as HTMLTextAreaElement).value)}
          class="w-full border border-gray-300 rounded-md p-2 my-2"
        />

        <Submit disabled={saveState == 'saving'} label={saveLabel} />
      </form>
    </div>
  )
}
