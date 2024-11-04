import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import isNil from "lodash/isNil";
import { PaperCard } from "./paperCard.tsx";

type Props = {
  valuePrimary?: string | number;
  valueSecondary?: string;
  label?: string;
  details?: ReactNode;
}

export const SummaryCard = ({ valuePrimary, valueSecondary, label, details }: Props) => (
  <PaperCard variant="outlined">
    <Box>
      {!isNil(valuePrimary) && <Typography variant="h1" component="span">{valuePrimary}</Typography>}
      {!isNil(valueSecondary) && <Typography variant="h4" component="span">{valueSecondary}</Typography>}
    </Box>
    {!!label && <Typography color="textSecondary">{label}</Typography>}
    {details}
  </PaperCard>
);
