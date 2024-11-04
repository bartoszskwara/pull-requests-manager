import { Dispatch, SetStateAction, useEffect, useState, ReactElement } from "react";
import { PullRequest } from "../usePrs";
import { iconComponents } from "../getIcon.tsx";

export type Filter = {
    id: string;
    label: string;
    icon: ReactElement;
    selected: boolean;
    matcher: (item: PullRequest) => boolean
};

type UseFilters = {
    data: PullRequest[];
};

type UseFiltersReturn = {
    filters: Filter[];
    setFilters: Dispatch<SetStateAction<Filter[]>>
};


export const useFilters = ({ data }: UseFilters): UseFiltersReturn => {
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    const filters: Filter[] = [
      {
        id: "open",
        label: `Open`,
        icon: iconComponents.open,
        matcher: ({ state }) => state === "open",
        selected: false
      },
      {
        id: "merged",
        label: `Merged`,
        icon: iconComponents.merged,
        matcher: ({ mergedAt }) => !!mergedAt,
        selected: true
      },
      {
        id: "unknown",
        label: `Unknown merged`,
        icon: iconComponents.unknown,
        matcher: ({ bugStatus, mergedAt }) => bugStatus === "unknown" && !!mergedAt,
        selected: false
      },
      {
        id: "bugged",
        label: `Bugged merged`,
        icon: iconComponents.bugs,
        matcher: ({ bugStatus, mergedAt }) => bugStatus === "bugs" && !!mergedAt,
        selected: false
      },
      {
        id: "closed",
        label: `Closed`,
        icon: iconComponents.closed,
        matcher: ({ state, mergedAt }) => state === "closed" && !mergedAt,
        selected: false
      }
    ];

    setFilters(filters);
  }, [data]);

  return {
    filters,
    setFilters
  };
};
