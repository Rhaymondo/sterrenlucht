"use client"

import { useEffect, useState } from "react"

export interface TypewriterPhrase {
  normal: string
  italic: string
}

interface TypewriterProps {
  words: TypewriterPhrase[]
  speed?: number
  delayBetweenWords?: number
  cursor?: boolean
  cursorChar?: string
  onComplete?: () => void
}

export function Typewriter({
  words,
  speed = 100,
  delayBetweenWords = 2000,
  cursor = true,
  cursorChar = "|",
  onComplete,
}: TypewriterProps) {
  const [charIndex, setCharIndex]   = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex]   = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [done, setDone]             = useState(false)

  const current     = words[wordIndex]
  const fullText    = current.normal + current.italic
  const isLastWord  = wordIndex === words.length - 1

  // Typing / deleting
  useEffect(() => {
    if (done) return

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < fullText.length) {
          setCharIndex((c) => c + 1)
        } else if (isLastWord) {
          setDone(true)
          onComplete?.()
        } else {
          setTimeout(() => setIsDeleting(true), delayBetweenWords)
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1)
        } else {
          setIsDeleting(false)
          setWordIndex((w) => (w + 1) % words.length)
        }
      }
    }, isDeleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, fullText, isDeleting, speed, delayBetweenWords, isLastWord, done, onComplete, words.length])

  // Cursor blink
  useEffect(() => {
    if (!cursor) return
    const id = setInterval(() => setShowCursor((v) => !v), 500)
    return () => clearInterval(id)
  }, [cursor])

  // Split display text into normal / italic segments
  const normalLen  = current.normal.length
  const normalPart = fullText.substring(0, Math.min(charIndex, normalLen))
  const italicPart = charIndex > normalLen ? fullText.substring(normalLen, charIndex) : ""

  return (
    <span>
      {normalPart}
      {italicPart && <em>{italicPart}</em>}
      {cursor && (
        <span className="ml-0.5 transition-opacity duration-75" style={{ opacity: showCursor ? 1 : 0 }}>
          {cursorChar}
        </span>
      )}
    </span>
  )
}
