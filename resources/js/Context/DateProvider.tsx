import { createContext, useContext, useState, ReactNode } from "react";
import { Locale, es } from "date-fns/locale";

export interface DateSettings {
  locale?: Locale;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

interface DateContextType extends DateSettings {
  updateSettings: (settings: Partial<DateSettings>) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<DateSettings>({
    locale: es, // español por defecto
    timezone: "America/Lima",
    dateFormat: "dd-MM-yyyy",
    timeFormat: "h:mm a",
  });

  const updateSettings = (newSettings: Partial<DateSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <DateContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => {
  const ctx = useContext(DateContext);
  if (!ctx) throw new Error("useDateContext must be used within DateProvider");
  return ctx;
};
