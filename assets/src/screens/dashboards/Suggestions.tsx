import { useState } from 'preact/hooks'

const Suggestions = ({ suggestions }: { suggestions: string[] }) => {
  const [clicked, setClicked] = useState<string>()

  return (
    <>
      <div class="my-4 flex gap-2 flex-wrap">
        {suggestions.map((s, i) => (
          <Pill onClick={() => setClicked(s)} key={i}>
            {s}
          </Pill>
        ))}
      </div>
      {clicked && (
        <div class="my-2">
          <div class="font-medium">{clicked}</div>
          Answers to your questions - coming soon!
        </div>
      )}
    </>
  )
}

const Pill = ({ children, onClick }: { children: string; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      class="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-sm cursor-pointer
        hover:bg-gray-300 border border-gray-500"
    >
      {children}
    </div>
  )
}

export default Suggestions
