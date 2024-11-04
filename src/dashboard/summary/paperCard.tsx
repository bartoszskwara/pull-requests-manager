import { Paper, styled } from "@mui/material";

export const PaperCard = styled(Paper)(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1
}));
