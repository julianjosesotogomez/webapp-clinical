"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  /** Earliest selectable month. Defaults to Jan 1900 (birth-date friendly). */
  startMonth?: Date
  /** Latest selectable month. Defaults to the current month. */
  endMonth?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  className,
  disabled = false,
  startMonth = new Date(1900, 0),
  endMonth = new Date(),
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "justify-start px-3 font-normal",
          !value && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon className="mr-2 size-4 shrink-0 opacity-50" />
        {value ? format(value, "P", { locale: es }) : placeholder}
      </Button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border bg-popover p-2 shadow-md">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            classNames={{ root: "w-full" }}
          />
        </div>
      )}
    </div>
  )
}
