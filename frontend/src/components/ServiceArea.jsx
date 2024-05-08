import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const areas = ['מרכז', 'צפון', 'דרום', 'שרון', 'ירושלים', 'שפלה', 'יהודה ושומרון'];

const ServiceAreaSelect = ({ value = [], onChange, error }) => {
    const [area, setArea] = useState(value || '');

    const handleChange = (event) => {
        const {
            target: { value: selectedAreas },
        } = event;

        setArea(selectedAreas);
        onChange(event);
    };

    return (
        <FormControl fullWidth error={error}>
            <InputLabel id="demo-multiple-checkbox-label">אזור שירות</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                name='serviceArea'
                value={area}
                onChange={handleChange}
                input={<OutlinedInput label="אזור שירות" />}
                renderValue={(selected) => selected.join(', ')}
                fullWidth
                MenuProps={MenuProps}
            >
                {areas.map((a) => (
                    <MenuItem key={a} value={a}>
                        <Checkbox checked={area.indexOf(a) > -1} />
                        <ListItemText primary={a} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ServiceAreaSelect;