import { XMarkIcon } from '@heroicons/react/24/outline'
import { StateUpdater, useState } from 'preact/hooks'

export type Suggestion = {
  id: string
  label: string
}

export const suggestionFromParams = (
  params: URLSearchParams,
  suggestions: Suggestion[]
): Suggestion | undefined => {
  const suggestionId = params.get('s')
  if (!suggestionId) return undefined
  return suggestions.find((s) => s.id == suggestionId)
}

const Suggestions = ({
  suggestions,
  suggestion,
  setSuggestion,
}: {
  suggestions: Suggestion[]
  suggestion: Suggestion | undefined
  setSuggestion: StateUpdater<Suggestion | undefined>
}) => {
  const setSuggestionAndUrl = (suggestion: Suggestion | undefined) => {
    setSuggestion(suggestion)
    const url = new URL(location.href)
    if (suggestion) url.searchParams.set('s', suggestion.id)
    history.pushState({}, '', url.toString())
  }

  if (suggestion) {
    return (
      <div class="my-4 flex gap-2 flex-wrap">
        <Pill selected onClick={() => setSuggestionAndUrl(undefined)}>
          {suggestion.label}
        </Pill>
      </div>
    )
  }

  return (
    <>
      <div class="my-4 flex gap-2 flex-wrap">
        {suggestions.map((s, i) => (
          <Pill onClick={() => setSuggestionAndUrl(s)} key={i}>
            {s.label}
          </Pill>
        ))}
      </div>
    </>
  )
}

const Pill = ({
  children,
  selected,
  onClick,
}: {
  selected?: boolean
  children: string
  onClick: () => void
}) => {
  return (
    <div
      onClick={onClick}
      class={
        'px-2 py-1 rounded-full text-gray-700 text-sm cursor-pointer border border-gray-500 flex items-center hover:bg-blue-300 ' +
        (selected ? 'bg-blue-100' : 'bg-white')
      }
    >
      {children}
      {selected && <XMarkIcon class="w-4 h-4 ml-2" />}
    </div>
  )
}

export default Suggestions
