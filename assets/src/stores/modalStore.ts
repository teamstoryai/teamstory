import { atom } from 'nanostores'

import { config } from '@/config'
import { Project } from '@/models'

class ModalStore {
  // --- stores

  newProjectModal = atom<boolean>(false)

  deleteProjectModal = atom<Project | false>(false)
}

export const modalStore = new ModalStore()
if (config.dev) (window as any)['modalStore'] = modalStore
