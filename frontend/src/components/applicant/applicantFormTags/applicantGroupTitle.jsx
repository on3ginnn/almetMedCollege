import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';


export const GroupTitle = ({ title }) => (
  <Grid size={{ xs: 6 }} sx={{ mt: { xs: 2, sm: 3 } }}>
    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
    >
      {title}
    </Typography>
    {/* <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} /> */}
  </Grid>
);