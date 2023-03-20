import { logger } from '@/utils'
import { useEffect } from 'preact/hooks'

export default function useOAuthPopup(
  onResult: (result: { service: string; code: string }) => void,
  onError: (error: string) => void
) {
  useEffect(() => {
    const messageListener = (message: MessageEvent) => {
      const data = message.data
      if (!data || data.type != 'oauth') return
      logger.info(data)

      if (data.event == 'closed') return

      if (data.error) onError(data.error)
      else if (data.result) onResult(data.result)
    }

    window.addEventListener('message', messageListener)
    return () => window.removeEventListener('message', messageListener)
  }, [])
}
