import { startOfDay, format, formatRelative, parseISO, formatDistance, differenceInDays } from "date-fns";
import { useDateContext } from "../Context/DateProvider";

type DateInput = string | Date | null | undefined;

export const useDate = () => {
  const { locale, timezone, dateFormat, timeFormat } = useDateContext();

  const parseDate = (date: DateInput): Date | null => {
    if (!date) return null;

    const d = typeof date === "string" ? parseISO(date) : date;
    
    // Para fechas sin hora, simplemente retorna el Date
    // parseISO ya interpreta "2025-12-08" como medianoche local
    return d;
  };

  const formatDate = (date: DateInput, customPattern?: string): string => {
    const parsed = parseDate(date);
    if (!parsed) return "";

    const pattern = customPattern || `${dateFormat}, ${timeFormat}`;
    return format(parsed, pattern, { locale });
  };

const formatRelativeTime = (date: DateInput): string => {
  const parsed = parseDate(date);
  if (!parsed) return "";
  
  const today = new Date();
  const targetDay = startOfDay(parsed);
  const todayStart = startOfDay(today);
  const daysDiff = differenceInDays(targetDay, todayStart);
  
  // Para días cercanos usa formatRelative y extrae solo la parte del día
  if (Math.abs(daysDiff) <= 1) {
    const relative = formatRelative(targetDay, todayStart, { locale });
    // Extrae solo la primera palabra ("hoy", "mañana", "ayer", "today", etc)
    return relative.split(' ')[0];
  }
  
  // Para fechas más lejanas usa formatDistance
  return formatDistance(targetDay, todayStart, { 
    addSuffix: true, 
    locale 
  });
};

  return { formatDate, formatRelativeTime, parseDate };
};
