import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller } from 'react-hook-form';
import InputMask from 'react-input-mask';


export const FormTextFieldMask = ({ name, label, mask, gridSize, control, textFieldError, textFieldHelperText }) => (
    <Grid size={gridSize}>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <InputMask mask={mask} {...field}>
                {(inputProps) => (
                    <TextField
                    {...inputProps}
                    fullWidth
                    label={label}
                    error={textFieldError}
                    helperText={textFieldHelperText}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                )}
                </InputMask>
            )}
        />
    </Grid>
);