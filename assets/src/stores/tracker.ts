import { config } from '@/config'
import { User } from '@/models'
import { authStore } from '@/stores/authStore'
import * as amplitude from '@amplitude/analytics-browser'

class Tracker {
  init(user: User | undefined) {
    if (!config.dev) amplitude.init('c68d038d897098b08adf9d5bd2d4f540')
    amplitude.setUserId(user?.id)
  }

  setup() {
    amplitude.logEvent('pageSetup')
  }

  dashboard() {
    amplitude.logEvent('pageDashboard')
  }

  reports() {
    amplitude.logEvent('pageReports')
  }
}

const tracker = new Tracker()
export default tracker
