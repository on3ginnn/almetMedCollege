import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller } from 'react-hook-form';


export const FormTextField = ({ name, label, gridSize, control, textFieldError, textFieldHelperText }) => (
    <Grid size={gridSize}>
        <Controller
        name={name}
        control={control}
        render={({ field }) => (
            <TextField
            {...field}
            fullWidth
            label={label}
            error={textFieldError}
            helperText={textFieldHelperText}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
        )}
        />
    </Grid>
);