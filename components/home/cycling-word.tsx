'use client'

import { useState, useEffect } from 'react'

export default function CyclingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'visible' | 'exit' | 'enter'>('visible')

  useEffect(() => {
    const hold = setTimeout(() => {
      setPhase('exit')
      const next = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setPhase('enter')
        const settle = setTimeout(() => setPhase('visible'), 150)
        return () => clearTimeout(settle)
      }, 150)
      return () => clearTimeout(next)
    }, 1700)
    return () => clearTimeout(hold)
  }, [index, words])

  const transform =
    phase === 'exit'  ? 'translateY(60%)'  :
    phase === 'enter' ? 'translateY(-60%)' :
    'translateY(0)'

  const opacity = phase === 'visible' ? 1 : 0

  return (
    <span
      className="inline-block"
      style={{
        transform,
        opacity,
        transition: 'transform 150ms cubic-bezier(0.4,0,0.2,1), opacity 150ms ease',
        willChange: 'transform, opacity',
        clipPath: 'inset(-20% 0 -20% 0)',
      }}
    >
      {words[index]}
    </span>
  )
}
