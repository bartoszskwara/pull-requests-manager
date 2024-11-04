import { Box, Typography } from "@mui/material";
import { useDashboardContext } from "../context/DashboardContextProvider.tsx";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import sortBy from "lodash/sortBy";
import entries from "lodash/entries";
import EastIcon from '@mui/icons-material/East';
import { Fragment } from "react";

const BASE_BRANCHES = ["master", "integration", "uat", "production"];

export const BaseBranches = () => {
  const { data: { allItems } } = useDashboardContext();

  const pullRequests = allItems.filter(({ base }) => BASE_BRANCHES.includes(base));
  const envs = mapValues(groupBy(pullRequests, "base"), (items) => items.length);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginTop: 2 }}>
      {sortBy(entries(envs), ([key]) => BASE_BRANCHES.indexOf(key)).map(([key, value]) => (
        <Fragment key={key}>
          <Typography variant="h6" component="span" sx={{ textAlign: "right" }}>{value} PRs</Typography>
          <Box sx={{ display: "grid", placeItems: "center" }}><EastIcon /></Box>
          <Typography variant="h6" component="span" sx={{ textAlign: "left" }}>{key}</Typography>
        </Fragment>
      ))}
    </Box>
  );
};
