import {
  ListItemIcon,
  Box,
  IconButton,
  Popover
} from "@mui/material";
import { useDashboardContext } from "../context/DashboardContextProvider.tsx";
import { PullRequest } from "../usePrs";
import { useState, MouseEvent } from "react";
import { getIcon, iconComponents } from "../getIcon.tsx";
import { BugStatus } from "../usePrs/getPRBugStatus.ts";

type Props = {
  item: PullRequest;
}

export const PullRequestIcon = ({ item }: Props) => {
  const { setData } = useDashboardContext();
  const [stateChangeMenuAnchor, setStateChangeMenuAnchor] = useState<HTMLButtonElement | null>(null);

  const handleIconClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setStateChangeMenuAnchor(event.currentTarget);
  };

  const handleIconClose = () => {
    setStateChangeMenuAnchor(null);
  };

  const handleIconChange = (status: BugStatus) => {
    setData((prevState) => ({ ...prevState, allItems: prevState.allItems.map((pr) => pr.number === item.number ? { ...pr, bugStatus: status } : pr) }));
    handleIconClose();
  };

  const icon = getIcon(item);

  const isStateChangeMenuOpen = Boolean(stateChangeMenuAnchor);
  const popoverId = isStateChangeMenuOpen ? 'state-change-menu' : undefined;

  const iconActions: BugStatus[] = ["clean", "bugs", "unknown"];
  
  return (
    <ListItemIcon>
      <IconButton onClick={handleIconClick}>
        {icon}
      </IconButton>
      <Popover
        id={popoverId}
        open={isStateChangeMenuOpen}
        anchorEl={stateChangeMenuAnchor}
        onClose={handleIconClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ paddingX: 2, paddingY: 1 }}>
          {iconActions.map((actionName) => (
            <IconButton key={actionName} onClick={() => handleIconChange(actionName)} disabled={item.bugStatus === actionName}>
              {iconComponents[actionName]}
            </IconButton>
          ))}
        </Box>
      </Popover>
    </ListItemIcon>
  );
};

