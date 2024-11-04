import CodeIcon from "@mui/icons-material/Code";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CancelIcon from "@mui/icons-material/Cancel";
import { PullRequest } from "./usePrs";
import BugReportIcon from "@mui/icons-material/BugReport";
import HelpIcon from '@mui/icons-material/Help';
import MergeIcon from '@mui/icons-material/Merge';

export const iconComponents = {
  clean: <CodeIcon />,
  merged: <MergeIcon />,
  bugs: <BugReportIcon sx={{ color: (theme) => theme.palette.error.main }} />,
  unknown: <HelpIcon sx={{ color: (theme) => theme.palette.warning.main }} />,
  closed: <CancelIcon sx={{ color: (theme) => theme.palette.error.main }} />,
  open: <AutoAwesomeIcon sx={{ color: (theme) => theme.palette.primary.main }} />,
};

export const getIcon = (item: PullRequest) => {
  const isClosed = item.state === "closed" && !item.mergedAt;
  const isOpen = item.state === "open";
  const isBugged = item.bugStatus === "bugs";
  const isUnknown = item.bugStatus === "unknown";

  if (isClosed) {
    return iconComponents.closed;
  } else if (isOpen) {
    return iconComponents.open;
  } else if (isUnknown) {
    return iconComponents.unknown;
  } else if (isBugged) {
    return iconComponents.bugs;
  } else {
    return iconComponents.clean;
  }
};
