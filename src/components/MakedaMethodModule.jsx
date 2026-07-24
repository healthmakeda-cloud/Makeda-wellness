import { useState } from 'react'

const steps = [
  { letter: 'M', word: 'Medical history', copy: 'Your full clinical picture — conditions, medications and treatment history.' },
  { letter: 'A', word: 'Anthropological context', copy: 'The cultural and lived context that shapes how you experience health.' },
  { letter: 'K', word: 'Key lifestyle influences', copy: 'Diet, sleep, stress and daily rhythms that support or strain your system.' },
  { letter: 'É', word: 'Emotional wellbeing', copy: "The emotional and mental layer that's inseparable from physical symptoms." },
  { letter: 'D', word: 'Digestive function', copy: "The gut as the root — what's happening beneath the surface." },
  { letter: 'A', word: 'Action plan', copy: 'A personalised, evidence-informed plan built from everything above.' }
]

export default function MakedaMethodModule() {
  const [open, setOpen] = useState(false)
  const [openLetter, setOpenLetter] = useState(null)

  return (
    <div className="max-w-2xl mx-auto bg-cream border border-moss/10 rounded-xl p-6 sm:p-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-display text-xl text-moss">What is the Makéda Method™?</span>
        <span className={`text-ochre font-mono text-sm transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="mt-6">
          <p className="text-sm text-ink/70 mb-5">
            Tap each letter to see what it means.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setOpenLetter(openLetter === i ? null : i)}
                className={`h-10 w-10 rounded-full font-display text-sm transition-colors ${
                  openLetter === i ? 'bg-ochre text-cream' : 'bg-moss text-linen hover:bg-ink'
                }`}
              >
                {s.letter}
              </button>
            ))}
          </div>

          {openLetter !== null && (
            <div className="border-t border-moss/10 pt-4">
              <p className="font-display text-moss">{steps[openLetter].word}</p>
              <p className="text-sm text-ink/70 mt-1">{steps[openLetter].copy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
