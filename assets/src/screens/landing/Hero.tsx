import Logo from '@/components/core/Logo'
import { paths } from '@/config'
import landing from '@/images/landing-unsplash.jpg'

export default () => (
  <>
    <div className="lg:relative lg:py-20/ bg-slate-50 overflow-hidden mt-8">
      <div
        className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:grid lg:max-w-7xl
          lg:grid-cols-2 lg:gap-24 lg:px-8"
      >
        <div>
          <div className="my-20">
            <div className="mt-6 sm:max-w-xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-center lg:text-left">
                <div className="">Increase velocity</div>
                <div className="text-slate-600">and team happiness?</div>
              </h1>
              <p className="mt-6 text-xl text-gray-500 leading-normal">
                Yes, it's possible. Discover how the best engineering teams get better by analyzing
                the past.
              </p>
              <div className="mt-10 flex flex-col items-center">
                <a
                  href={paths.SIGNUP}
                  className="mx-auto px-8 py-3 border border-transparent
            text-base font-medium rounded-md text-white bg-slate-600 hover:bg-slate-800
            md:py-4 md:text-lg md:px-10"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
        <div className="sm:relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="hidden sm:block w-full h-full">
            <img src={landing} class="object-cover w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  </>
)
