import { Box, CircularProgress, CircularProgressProps, Typography } from "@mui/material";

type Props = CircularProgressProps & { value: number };

export const PercentageProgress = ({ value, ...rest }: Props)=> (
  <Box sx={{ position: "relative", display: "inline-flex" }}>
    <CircularProgress variant="determinate" value={value} {...rest} />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="caption"
        component="div"
        color="textSecondary"
      >{`${Math.round(value)}%`}</Typography>
    </Box>
  </Box>
);
