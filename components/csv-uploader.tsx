"use client"

import { useCallback, useState, useRef } from "react"
import { Upload, FileSpreadsheet } from "lucide-react"
import { cn } from "@/lib/utils"

interface CsvUploaderProps {
  onFileLoaded: (lines: string[][], headers: string[]) => void
}

export function CsvUploader({ onFileLoaded }: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = useCallback(
    (text: string) => {
      const rows = text
        .split(/\r?\n/)
        .map((row) => row.trim())
        .filter((row) => row.length > 0)

      if (rows.length < 2) return

      const headers = rows[0].split(",").map((h) => h.trim())
      const lines = rows.slice(1).map((row) => row.split(",").map((cell) => cell.trim()))

      onFileLoaded(lines, headers)
    },
    [onFileLoaded]
  )

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        if (text) parseCSV(text)
      }
      reader.readAsText(file)
    },
    [parseCSV]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : fileName
            ? "border-primary/40 bg-primary/5"
            : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      <div className="flex flex-col items-center gap-4">
        {fileName ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{fileName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {"הקובץ נטען בהצלחה! לחץ כאן להחלפת קובץ"}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {"גרור ושחרר קובץ CSV כאן"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {"או לחץ לבחירת קובץ מהמחשב"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
