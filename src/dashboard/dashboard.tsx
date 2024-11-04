import { useState } from "react";
import { Summary } from "./summary";
import { RequestForm, SearchParams } from "./requestForm.tsx";
import { List } from "./list.tsx";
import { Alert, Box, LinearProgress } from "@mui/material";
import { useDashboardContext } from "./context/DashboardContextProvider.tsx";

export const Dashboard = () => {
  const [wasSearched, setWasSearched] = useState<boolean>(false);
  const { data: { allItems }, loading, fetchPullRequests } = useDashboardContext();

  const handleSearch = (params: SearchParams) => {
    setWasSearched(true);
    fetchPullRequests(params);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, padding: 4, maxWidth: "80%", margin: "auto" }}>
      <RequestForm onSearch={handleSearch} />
      {loading && (
        <Box sx={{ paddingY: 2 }}>
          <LinearProgress />
        </Box>
      )}
      {!loading && (
        <>
          {wasSearched && allItems.length === 0 && (
            <Box sx={{ paddingY: 2 }}>
              <Alert severity="success">No PRs found</Alert>
            </Box>
          )}
          <Summary />
          <List />
        </>
      )}
    </Box>
  );
};
