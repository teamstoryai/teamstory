import { unwrapError } from '@/utils'

export default ({ error }: { error: Error | string | null | undefined }) => (
  <>
    {error && (
      <div className="my-4 text-center text-red-600 font-semibold">{unwrapError(error)}</div>
    )}
  </>
)
