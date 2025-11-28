import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/en-gb";
import dayjs from "dayjs";

export default function MUIDatePicker({ name, label, value, onChange }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DatePicker
                name={name}
                label={label}
                className="w-full"
                format="DD/MM/YYYY"
                value={value ? dayjs(value) : null}
                onChange={(newValue) =>
                    onChange(newValue)
                }
            />
        </LocalizationProvider>
    );
}