"use client"

import { useState } from "react"
import { CsvUploader } from "@/components/csv-uploader"
import { RandomPicker } from "@/components/random-picker"
import { Dices } from "lucide-react"

export default function Home() {
  const [lines, setLines] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const handleFileLoaded = (newLines: string[][], newHeaders: string[]) => {
    setLines(newLines)
    setHeaders(newHeaders)
    setIsLoaded(true)
  }

  const handleReset = () => {
    setLines([])
    setHeaders([])
    setIsLoaded(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Dices className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            {"בוחר שורה אקראית"}
          </h1>
          <p className="mt-3 text-base text-muted-foreground text-pretty">
            {"העלה קובץ CSV וקבל שורה אקראית בלחיצת כפתור"}
          </p>
        </div>

        {/* Upload section */}
        <div className="mb-8">
          <CsvUploader onFileLoaded={handleFileLoaded} />
        </div>

        {/* Picker section */}
        {isLoaded && lines.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RandomPicker lines={lines} headers={headers} />

            <div className="mt-6 text-center">
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {"העלה קובץ אחר"}
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {isLoaded && lines.length === 0 && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-sm font-medium text-destructive">
              {"הקובץ ריק או לא תקין. ודא שהקובץ מכיל לפחות כותרת ושורה אחת."}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-xs text-muted-foreground">
            {"הקובץ נקרא בדפדפן בלבד ולא נשלח לשום שרת"}
          </p>
        </footer>
      </div>
    </main>
  )
}
