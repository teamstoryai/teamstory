import { paths } from '@/config'

export default function ({ dark }: { dark?: boolean }) {
  return (
    <footer className={dark ? 'bg-slate-900' : 'bg-white'}>
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p className="mt-8 text-center text-base text-gray-400">
          <a href={paths.TERMS} class="hover:underline">
            Terms of Use
          </a>{' '}
          |{' '}
          <a class="hover:underline" href={paths.PRIVACY}>
            Privacy Policy
          </a>
        </p>
        <p className="mt-1 text-center text-base text-gray-400">
          &copy; 2023 Bridge to the Future LLC. All rights reserved.
        </p>
        <div className="mt-2 text-center text-xs text-gray-400">
          Icons by{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            flaticon
          </a>
        </div>
      </div>
    </footer>
  )
}
