import { Alert, Box } from "@mui/material";
import { useDashboardContext } from "../context/DashboardContextProvider";
import { SummaryCard } from "./summaryCard.tsx";
import { BaseBranches } from "./baseBranches.tsx";
import { Score } from "./score.tsx";
import { Stats } from "./stats.tsx";
import { Reviewed } from "./reviewed.tsx";

export const Summary = () => {
  const { data: { allItems, visibleItemNumbers }, selectedItems } = useDashboardContext();

  const visibleItems = allItems.filter(({ number }) => visibleItemNumbers.includes(number));
  const selectedPRs = visibleItems.filter(({ number }) => selectedItems.has(number));

  const total = selectedPRs.length;
  const bugged = selectedPRs.filter(({ bugStatus }) => bugStatus === "bugs").length;
  const unknown = selectedPRs.filter(({ bugStatus }) => bugStatus === "unknown").length;

  if (allItems.length === 0) {
    return;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 3 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
        <SummaryCard
          valuePrimary={allItems.length}
          label="ALL PULL REQUESTS"
        />
        <SummaryCard
          valuePrimary={bugged}
          valueSecondary={`/ ${total}`}
          label="BUGGED / TOTAL SELECTED"
        />
        <SummaryCard
          valuePrimary={total ? Math.round((bugged / total) * 100) : "N/A"}
          valueSecondary="%"
          label="OF PRs BUGGED"
        />
        <SummaryCard details={<><BaseBranches /><Stats total={allItems.length} /></>} />
        <Reviewed />
        <Score total={total} bugged={bugged} />
      </Box>
      {!!unknown && <Alert severity="warning">{unknown} of the selected PRs cannot be categorised - please review</Alert>}
    </Box>
  );
};
