import { FormControlLabel, Checkbox } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller } from 'react-hook-form';


export const FormCheckbox = ({ name, label, gridSize, control }) => (
  <Grid size={gridSize}>
    <Controller
    name={name}
    control={control}
    render={({ field }) => (
        <FormControlLabel
        control={<Checkbox {...field} checked={field.value} />}
        label={label}
        sx={{
            '& .MuiFormControlLabel-label': { fontSize: { xs: '0.9rem', sm: '1rem' } },
        }}
        />
    )}
    />
  </Grid>
);