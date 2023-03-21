import linearLogo from '@/images/linear.png'
import jiraLogo from '@/images/jira.png'
import { ConnectButton } from './ConnectButton'
import { config } from '@/config'
import useOAuthPopup from '@/hooks/useOAuthPopup'
import { StateUpdater, useEffect, useState } from 'preact/hooks'
import { projectStore } from '@/stores/projectStore'
import { tokenStore } from '@/stores/tokenStore'
import { logger, toTitleCase } from '@/utils'
import ErrorMessage from '@/components/core/ErrorMessage'
import { OAuthToken } from '@/models'

export const Step3 = ({ setStep }: { setStep: StateUpdater<number> }) => {
  return (
    <div class="mb-12">
      <h1 class="text-lg my-2">3. Onboarding</h1>
      <p class="text-gray-700">Awesome! We will contact you when your dashboard is ready.</p>

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
