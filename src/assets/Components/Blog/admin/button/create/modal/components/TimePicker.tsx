import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import styles from './TimePicker.module.scss';

import * as React from 'react';

interface TimePickerProps {
    value?: string;
    setTime?: (value: string) => void;
}


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00bcd4',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#e0f7fa',
            secondary: '#b2ebf2',
        },
    },
});

export default function TimePicker({ value, setTime }: TimePickerProps) {
    // Si se pasa value, lo usamos; si no, usamos un valor local
    const [localValue, setLocalValue] = React.useState(dayjs('2022-04-17T15:30', 'YYYY-MM-DDTHH:mm'));

    // Formato de hora para mostrar y enviar
    const TIME_FORMAT = 'HH:mm';

    // Si el value viene en formato HH:mm, lo parseamos
    const pickerValue = value
        ? dayjs(value, TIME_FORMAT)
        : localValue;

    const handleChange = (newValue: any) => {
        setLocalValue(newValue);
        if (setTime) {
            // Enviar solo la hora en formato HH:mm
            setTime(newValue ? newValue.format(TIME_FORMAT) : '');
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileTimePicker']}>
                    <DemoItem className={styles.timepicker}>
                        <MobileTimePicker
                            value={pickerValue}
                            onChange={handleChange}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    className: `form-control ${styles.timepicker}`,
                                },
                            }}
                        />
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
