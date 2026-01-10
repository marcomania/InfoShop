import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function MUIDatePicker({ name, label, value, onChange }) {
  const date = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 text-sm">{label}</label>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {date ? format(date, "dd/MM/yyyy") : "Select date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => onChange(newDate ? newDate.toISOString() : null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
