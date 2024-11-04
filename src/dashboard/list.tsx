import { Box, Chip, List as MUIList, Typography } from "@mui/material";
import { useDashboardContext } from "./context/DashboardContextProvider.tsx";
import { PullRequestItem } from "./pullRequestItem";

export const List = () => {
  const { data: { allItems, visibleItemNumbers }, filters, setFilters } = useDashboardContext();

  const toggleFilter = (id: string) => {
    setFilters((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item ))
    );
  };

  if (!allItems.length) {
    return null;
  }

  const visibleItems = allItems.filter(({ number }) => visibleItemNumbers.includes(number));
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography color="textSecondary" sx={{ marginX: 4, marginY: 2 }}>{visibleItems.length} / {allItems.length} items</Typography>
        {filters.map(({ id, label, icon, selected, matcher }) => {
          const matchingCount = allItems.filter(matcher).length;
          return (
            <Chip
              key={id}
              color={selected ? "primary" : "default"}
              icon={icon}
              label={`${label} (${matchingCount})`}
              onClick={() => toggleFilter(id)}
              disabled={matchingCount === 0}
            />
          );
        })}
      </Box>
      {!!visibleItems.length && (
        <MUIList>
          {visibleItems.map((pr) => (
            <PullRequestItem key={pr.number} item={pr} />
          ))}
        </MUIList>
      )}
    </Box>
  );
};

