"use client"

import { useState, useEffect, useCallback } from "react"
import { Shuffle, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RandomPickerProps {
  lines: string[][]
  headers: string[]
}

export function RandomPicker({ lines, headers }: RandomPickerProps) {
  const [selectedLine, setSelectedLine] = useState<string[] | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayLine, setDisplayLine] = useState<string[] | null>(null)

  const pickRandom = useCallback(() => {
    if (lines.length === 0) return

    setIsAnimating(true)
    setSelectedLine(null)

    let count = 0
    const totalFlashes = 12
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * lines.length)
      setDisplayLine(lines[randomIndex])
      count++
      if (count >= totalFlashes) {
        clearInterval(interval)
        const finalIndex = Math.floor(Math.random() * lines.length)
        setSelectedLine(lines[finalIndex])
        setDisplayLine(lines[finalIndex])
        setIsAnimating(false)
      }
    }, 100)
  }, [lines])

  const reset = useCallback(() => {
    setSelectedLine(null)
    setDisplayLine(null)
  }, [])

  useEffect(() => {
    reset()
  }, [lines, reset])

  const currentDisplay = displayLine || selectedLine

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Info bar */}
      <div className="flex w-full items-center justify-between rounded-lg bg-secondary px-5 py-3">
        <span className="text-sm font-medium text-secondary-foreground">
          {"סה\"כ שורות בקובץ"}
        </span>
        <span className="rounded-md bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
          {lines.length}
        </span>
      </div>

      {/* Result display */}
      {currentDisplay && (
        <div
          className={`w-full overflow-hidden rounded-xl border-2 transition-all duration-500 ${
            isAnimating
              ? "border-accent/60 bg-accent/5"
              : selectedLine
                ? "border-primary bg-card shadow-lg shadow-primary/10"
                : "border-border bg-card"
          }`}
        >
          <div className="p-6">
            {selectedLine && !isAnimating && (
              <div className="mb-4 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-accent">{"התוצאה שנבחרה"}</span>
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
            )}
            <div className="grid gap-3">
              {headers.map((header, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-foreground">{header}</span>
                  <span
                    className={`text-sm transition-all ${
                      isAnimating ? "text-muted-foreground blur-[1px]" : "font-medium text-primary"
                    }`}
                  >
                    {currentDisplay[i] || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          onClick={pickRandom}
          disabled={isAnimating}
          className="min-w-[180px] gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
        >
          <Shuffle className="h-5 w-5" />
          {isAnimating ? "בוחר..." : selectedLine ? "בחר שוב" : "בחר שורה אקראית"}
        </Button>
        {selectedLine && !isAnimating && (
          <Button
            size="lg"
            variant="outline"
            onClick={reset}
            className="gap-2 border-border text-foreground hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" />
            {"אפס"}
          </Button>
        )}
      </div>
    </div>
  )
}
