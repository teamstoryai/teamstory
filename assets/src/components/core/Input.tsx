import { Ref } from 'preact'
import { twMerge } from 'tailwind-merge'

type Props = {
  label: string
  labelClassName?: string
  forwardRef?: Ref<HTMLInputElement>
} & JSX.HTMLAttributes<HTMLInputElement>

export default (props: Props) => {
  const { label, labelClassName, className, forwardRef, ...rest } = props
  return (
    <div className="mb-2">
      {label && (
        <label
          htmlFor={props.id}
          className={twMerge('block text-sm font-medium text-gray-700', labelClassName)}
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          ref={forwardRef}
          {...rest}
          className={twMerge(
            `appearance-none block w-full px-3 py-2 border border-gray-300
             rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500
           focus:border-blue-500 text-sm`,
            className
          )}
        />
      </div>
    </div>
  )
}
