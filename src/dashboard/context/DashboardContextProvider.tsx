import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { PullRequest, usePrs } from "../usePrs";
import { SearchParams } from "../requestForm.tsx";
import { Filter, useFilters } from "./useFilters.tsx";
import { cloneDeep } from "lodash";
import { GithubPullRequest } from "./api.ts";

const UNSELECTED_LABELS = ["does not touch product", "Based on another branch"];
const UNSELECTED_TITLES = ["mergeback", "conflicts resolved"];

type DashboardContextType = {
    owner: string;
    setOwner: Dispatch<SetStateAction<string>>
    repo: string;
    setRepo: Dispatch<SetStateAction<string>>
    apiKey: string;
    setApiKey: Dispatch<SetStateAction<string>>
    author: string;
    setAuthor: Dispatch<SetStateAction<string>>
    startDate: Dayjs | null;
    setStartDate: Dispatch<SetStateAction<Dayjs | null>>
    endDate: Dayjs | null;
    setEndDate: Dispatch<SetStateAction<Dayjs | null>>
    data: { allItems: PullRequest[]; visibleItemNumbers: number[] }
    setData: Dispatch<SetStateAction<{ allItems: PullRequest[]; visibleItemNumbers: number[] }>>;
    loading: boolean;
    fetchPullRequests: (params: SearchParams) => void;
    selectedItems: Set<number>;
    setSelectedItems: Dispatch<SetStateAction<Set<number>>>
    filters: Filter[];
    setFilters: Dispatch<SetStateAction<Filter[]>>;
    availableAuthors: string[];
    dataOfDifferentAuthors: Pick<GithubPullRequest, "number" | "user" | "state" | "merged_at">[];
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardContextProvider");
  }
  return context;
};

export const DashboardContextProvider = ({ children }: PropsWithChildren) => {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [data, setData] = useState<DashboardContextType["data"]>({ allItems: [], visibleItemNumbers: [] });

  const { fetchPullRequests, loading, data: originalData, availableAuthors, dataOfDifferentAuthors } = usePrs();
  const { filters, setFilters } = useFilters({ data: originalData });

  useEffect(() => {
    const items = new Set(
      originalData
        .filter(({ labels, mergedAt, title }) => (
          !labels.find(({ name }) => UNSELECTED_LABELS.includes(name)) &&
          !!mergedAt &&
          !UNSELECTED_TITLES.some((text) => title.toLowerCase().includes(text))
        ))
        .map(({ number: prNumber }) => prNumber)
    );
    setSelectedItems(items);
    setData({ allItems: cloneDeep(originalData), visibleItemNumbers: originalData.map(({ number: prNumber }) => prNumber) });
  }, [originalData]);

  useEffect(() => {
    const selectedFilters = filters.filter(({ selected }) => selected);
   
    setData((prevState) => {
      const visibleItemNumbers = prevState.allItems
        .filter((item) => selectedFilters.some(({ matcher }) => matcher(item)))
        .map(({ number }) => number);
      return ({ ...prevState, visibleItemNumbers });
    });
  }, [filters, data.allItems]);

  return (
    <DashboardContext.Provider
      value={{
        owner,
        setOwner,
        repo,
        setRepo,
        apiKey,
        setApiKey,
        author,
        setAuthor,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        fetchPullRequests,
        loading,
        data,
        setData,
        selectedItems,
        setSelectedItems,
        filters,
        setFilters,
        availableAuthors,
        dataOfDifferentAuthors
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
