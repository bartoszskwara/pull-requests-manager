import { useDashboardContext } from "../context/DashboardContextProvider.tsx";
import dayjs from "dayjs";
import { Typography } from "@mui/material";

type Props = {
  total: number;
};

export const Stats = ({ total }: Props) => {
  const { startDate, endDate } = useDashboardContext();
  const days = dayjs(endDate).diff(startDate, "days");
  const countPerWeek = Math.round((total / days) * 7 * 100) / 100;
  return (
    <Typography variant="h6" sx={{ marginTop: 1 }}>{countPerWeek} PRs / week</Typography>
  );
};
