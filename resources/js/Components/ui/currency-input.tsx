"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  currency?: string
  value?: number
  onChange?: (value: number) => void
  error?: string
  showValidationHints?: boolean
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    MXN: "$",
    COP: "$",
    ARS: "$",
    CLP: "$",
    PEN: "S/",
    BRL: "R$",
    CAD: "C$",
    AUD: "A$",
  }
  return symbols[currency] || currency
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[^\d,.-]/g, "").replace(",", ".");
  const normalized = cleanValue.replace(/(?!^)-/g, "");
  const parsed = Number.parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed
}

export function CurrencyInput({
  currency = "USD",
  value = 0,
  onChange,
  error,
  showValidationHints = true,
  className,
  disabled,
  placeholder = "0.00",
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)

  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue( formatCurrency(value, currency) )
    }

  }, [value, currency, isFocused])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setDisplayValue(value.toString() )
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    let numericValue = parseCurrency(displayValue)

    onChange?.(numericValue)
    setDisplayValue( formatCurrency(numericValue, currency) )
    props.onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)

    if (isFocused) {
      const numericValue = parseCurrency(inputValue)
      onChange?.(numericValue)
    }
  }

  const currencySymbol = getCurrencySymbol(currency)

  return (
    <div className="relative">
      <div className="absolute left-3 top-4 -translate-y-1/2 flex items-center text-muted-foreground font-medium pointer-events-none">
        {currencySymbol}
      </div>
      <Input
        {...props}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "pl-8 pr-4 text-right font-mono transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      />
    </div>
  )
}