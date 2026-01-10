"use client"

import * as React from "react"
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  className?: string
  placeholder?: string
  align?: "start" | "center" | "end"
}

const presetRanges = [
  {
    label: "Hoy",
    getValue: () => {
      const today = new Date()
      return { from: today, to: today }
    },
  },
  {
    label: "Ayer",
    getValue: () => {
      const yesterday = subDays(new Date(), 1)
      return { from: yesterday, to: yesterday }
    },
  },
  {
    label: "Últimos 7 días",
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Últimos 30 días",
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "Esta semana",
    getValue: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Semana pasada",
    getValue: () => {
      const lastWeek = subDays(new Date(), 7)
      return {
        from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      }
    },
  },
  {
    label: "Este mes",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Mes pasado",
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1)
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      }
    },
  },
  {
    label: "Este año",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: new Date(),
    }),
  },
  {
    label: "Año pasado",
    getValue: () => {
      const lastYear = subYears(new Date(), 1)
      return {
        from: startOfYear(lastYear),
        to: new Date(lastYear.getFullYear(), 11, 31),
      }
    },
  },
]

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Seleccionar rango de fechas",
  align = "start",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handlePresetClick = (preset: (typeof presetRanges)[0]) => {
    onChange?.(preset.getValue())
    setOpen(false)
  }

  const handleCalendarSelect = (range: DateRange | undefined) => {
    onChange?.(range)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "dd MMM yyyy", { locale: es })} - {format(value.to, "dd MMM yyyy", { locale: es })}
              </>
            ) : (
              format(value.from, "dd MMM yyyy", { locale: es })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex">
          {/* Rangos predefinidos */}
          <div className="border-r p-2 space-y-1 w-[150px]">
            <p className="text-sm font-medium text-muted-foreground px-2 py-1.5">Rangos rápidos</p>
            {presetRanges.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm font-normal"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          {/* Calendario */}
          <div className="p-2">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
              locale={es}
            />
          </div>
        </div>
        {/* Footer con botón limpiar */}
        <div className="border-t p-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange?.(undefined)
              setOpen(false)
            }}
          >
            Limpiar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
