import {
  ListItemText,
  Typography,
  Box
} from "@mui/material";
import dayjs from "dayjs";
import { PullRequest } from "../usePrs";
import { Fragment, ReactNode } from "react";

const VISIBLE_LABELS = ["does not touch product", "uat", "production", "integration", "Based on another branch"];
const insertBulletsBetweenElements = (array: ReactNode[]): ReactNode[] => (
  array.flatMap((item, index) =>
    index < array.length - 1 ? [item, " • "] : [item]
  )
);

type Props = {
  item: PullRequest;
}

export const PullRequestContent = ({ item }: Props) => {
  const isClosed = item.state === "closed" && !item.mergedAt;

  const labels = [
    ...item.labels.filter(({ name }) => VISIBLE_LABELS.includes(name))
  ];

  const stateLabel = <Box component="span" sx={{ color: isClosed ? "#cc0000" : undefined }}>{item.state}</Box>;
  const secondaryText = insertBulletsBetweenElements([
    `#${item.number}`,
    `created: ${dayjs(item.createdAt).format("DD-MM-YYYY")}`,
    ...(item.mergedAt ? [`merged: ${dayjs(item.mergedAt).format("DD-MM-YYYY")}`] : [stateLabel]),
    ...labels.map(({ name }) => name)
  ]);

  return (
    <ListItemText
      primary={(
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
          <Typography>{item.title}</Typography>
        </Box>
      )}
      secondary={(
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: 1 }}
        >
          {secondaryText.map((item, index) => <Fragment key={index}>{item}</Fragment>)}
        </Typography>
      )}
    />
  );
};

