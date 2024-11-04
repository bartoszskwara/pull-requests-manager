import {
  Checkbox,
  ListItem,
  ListItemButton
} from "@mui/material";
import { useDashboardContext } from "../context/DashboardContextProvider.tsx";
import { PullRequest } from "../usePrs";
import { PullRequestIcon } from "./pullRequestIcon.tsx";
import { PullRequestContent } from "./pullRequestContent.tsx";

type Props = {
  item: PullRequest;
}

export const PullRequestItem = ({ item }: Props) => {
  const { selectedItems, setSelectedItems } = useDashboardContext();

  const handleToggleItem = (prNumber: number, enabled: boolean) => setSelectedItems((prev) => {
    const newSet = new Set(prev);
    if (enabled) {
      newSet.add(prNumber);
    } else {
      newSet.delete(prNumber);
    }
    return newSet;
  });

  const handleRedirect = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <ListItem
      secondaryAction={
        <Checkbox
          edge="end"
          onChange={({ target: { checked } }) => handleToggleItem(item.number, checked)}
          checked={selectedItems.has(item.number)}
        />
      }
    >
      <PullRequestIcon item={item} />
      <ListItemButton onClick={() => handleRedirect(item.url)}>
        <PullRequestContent item={item} />
      </ListItemButton>
    </ListItem>
  );
};

