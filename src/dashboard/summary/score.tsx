import { Box, Tooltip, Typography } from "@mui/material";
import { SummaryCard } from "./summaryCard.tsx";

type Props = {
  total: number;
  bugged: number;
};

export const Score = ({ total, bugged }: Props) => (
  <Tooltip
    slotProps={{
      tooltip: { sx: { maxWidth: 400 } }
    }}
    title={(
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        The metric takes into account the number of all PRs and the number of bugged PRs<br />
        <strong>(All PRs - Bugged PRs) × All PRs</strong>
      </Typography>
    )}
  >
    <Box sx={{ display: "flex" }}>
      <SummaryCard label="SCORE" valuePrimary={(total - bugged) * total} />
    </Box>
  </Tooltip>
);
