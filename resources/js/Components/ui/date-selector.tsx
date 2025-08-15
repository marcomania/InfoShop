"use client"

import * as React from "react"
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { format, addDays, addMonths, addYears, isValid, parse } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateSelectorProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
}

export function DateSelector({
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  label,
  disabled = false,
  className
}: DateSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [focusedPart, setFocusedPart] = React.useState<'day' | 'month' | 'year'>('day')
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sincronizar el valor del input con la fecha seleccionada
  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"))
    } else {
      setInputValue("")
    }
  }, [value])

  // Determinar qué parte de la fecha está enfocada basado en la posición del cursor
  const updateFocusedPart = () => {
    if (!inputRef.current) return
    
    const cursorPosition = inputRef.current.selectionStart || 0
    if (cursorPosition <= 2) {
      setFocusedPart('day')
    } else if (cursorPosition <= 5) {
      setFocusedPart('month')
    } else {
      setFocusedPart('year')
    }
  }

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Intentar parsear la fecha si tiene el formato correcto
    if (newValue.length === 10) {
      const parsedDate = parse(newValue, "dd/MM/yyyy", new Date())
      if (isValid(parsedDate)) {
        onChange?.(parsedDate)
      }
    }
  }

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!value || !isValid(value)) return

    let newDate: Date | undefined = undefined

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        if (focusedPart === 'day') {
          newDate = addDays(value, 1)
        } else if (focusedPart === 'month') {
          newDate = addMonths(value, 1)
        } else if (focusedPart === 'year') {
          newDate = addYears(value, 1)
        }
        break

      case 'ArrowDown':
        e.preventDefault()
        if (focusedPart === 'day') {
          newDate = addDays(value, -1)
        } else if (focusedPart === 'month') {
          newDate = addMonths(value, -1)
        } else if (focusedPart === 'year') {
          newDate = addYears(value, -1)
        }
        break

      case 'ArrowLeft':
        e.preventDefault()
        if (focusedPart === 'month') {
          setFocusedPart('day')
          setTimeout(() => inputRef.current?.setSelectionRange(0, 2), 0)
        } else if (focusedPart === 'year') {
          setFocusedPart('month')
          setTimeout(() => inputRef.current?.setSelectionRange(3, 5), 0)
        }
        return

      case 'ArrowRight':
        e.preventDefault()
        if (focusedPart === 'day') {
          setFocusedPart('month')
          setTimeout(() => inputRef.current?.setSelectionRange(3, 5), 0)
        } else if (focusedPart === 'month') {
          setFocusedPart('year')
          setTimeout(() => inputRef.current?.setSelectionRange(6, 10), 0)
        }
        return

      case 'Enter':
        e.preventDefault()
        setOpen(true)
        return

      case 'Escape':
        e.preventDefault()
        setOpen(false)
        return
    }

    if (newDate && isValid(newDate)) {
      onChange?.(newDate)
    }
  }

  // Manejar selección desde el calendario
  const handleCalendarSelect = (date: Date | undefined) => {
    onChange?.(date)
    setOpen(false)
    inputRef.current?.focus()
  }

  // Manejar clic en el input para determinar la parte enfocada
  const handleInputClick = () => {
    updateFocusedPart()
  }

  // Seleccionar la parte correspondiente cuando cambia el foco
  React.useEffect(() => {
    if (!inputRef.current || !inputValue) return

    let start = 0, end = 0
    switch (focusedPart) {
      case 'day':
        start = 0
        end = 2
        break
      case 'month':
        start = 3
        end = 5
        break
      case 'year':
        start = 6
        end = 10
        break
    }

    setTimeout(() => {
      inputRef.current?.setSelectionRange(start, end)
    }, 0)
  }, [focusedPart, inputValue])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label htmlFor="date-selector" className="text-sm font-medium">
          {label}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          <Input
            ref={inputRef}
            id="date-selector"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            onFocus={updateFocusedPart}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-10"
            maxLength={10}
          />
          
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-muted"
                disabled={disabled}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Abrir calendario</span>
              </Button>
            </PopoverTrigger>
              <ChevronDown className={cn(
                  "h-4 w-4 self-center transition-transform",
                  open && "rotate-180"
                )} />
          </div>
        </div>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleCalendarSelect}
             disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
            locale={es}
            autoFocus
            className="rounded-md border-0"
          />
        </PopoverContent>
      </Popover>

      
    </div>
  )
}
