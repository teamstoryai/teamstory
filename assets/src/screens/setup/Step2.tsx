import linearLogo from '@/images/linear.png'
import jiraLogo from '@/images/jira.png'
import { ConnectButton } from './ConnectButton'

export const Step2 = () => (
  <div class="mb-12">
    <h1 class="text-lg my-2">2. Connect project management</h1>
    <p class="text-gray-500">Where does your team track stories and bugs?</p>

    <div class="flex flex-row items-center justify-center mt-8 gap-8">
      <ConnectButton icon={linearLogo} text="Connect Linear" />
      <ConnectButton comingSoon icon={jiraLogo} text="Connect Jira" />
    </div>

    <div class="text-sm my-2 opacity-70 text-center">
      Do you use a different issue tracker?{' '}
      <a target="_blank" href="mailto:support@teamstory.ai" class="underline cursor-pointer">
        Let us know.
      </a>
    </div>
  </div>
)
