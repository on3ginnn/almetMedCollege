import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller } from 'react-hook-form';


export const SelectField = ({ name, label, options, gridSize, control, formControlError, formHelperText, inputSize }) => (
  <Grid size={gridSize}>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={formControlError}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            size={inputSize.sm}
            sx={{ borderRadius: 2 }}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300 } },
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{formHelperText}</FormHelperText>
        </FormControl>
      )}
    />
  </Grid>
);