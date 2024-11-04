import { Autocomplete, Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState, FormEvent } from "react";
import dayjs from 'dayjs';
import { useDashboardContext } from "./context/DashboardContextProvider.tsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import every from "lodash/every";
import values from "lodash/values";

const OWNER_LS = "PRMANAGER-OWNER";
const REPO_LS = "PRMANAGER-REPO";
const APIKEY_LS = "PRMANAGER-APIKEY";
const AUTHOR_LS = "PRMANAGER-AUTHOR";
const STARTDATE_LS = "PRMANAGER-FROM";
const ENDDATE_LS = "PRMANAGER-TO";
const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

export type SearchParams = {
  apiKey: string;
  author: string;
  startDate: string;
  endDate: string;
  repo: string;
  owner: string;
}

type LocalRequestData = {
  apiKey: string;
  author: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  repo: string;
  owner: string;
}

type RequestFormProps = {
  onSearch: (params: SearchParams) => void;
}

export const RequestForm = ({ onSearch }: RequestFormProps) => {
  const {
    setApiKey,
    setAuthor,
    setStartDate,
    setEndDate,
    setOwner,
    setRepo,
    availableAuthors
  } = useDashboardContext();
  const [error, setError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [localRequestData, setLocalRequestData] = useState<LocalRequestData>({
    apiKey: "",
    author: "",
    startDate: dayjs().subtract(1, 'month').startOf('month'),
    endDate: dayjs().subtract(1, 'month').endOf('month'),
    repo: "",
    owner: ""
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const handleLocalFieldChange = (fieldName: keyof LocalRequestData, value: string, localStorageKey: string) => {
    setLocalRequestData((prev) => ({ ...prev, [fieldName]: value }));
    localStorage.setItem(localStorageKey, value);
  };

  const handleStartDate = (value: Dayjs | null) => {
    setLocalRequestData((prev) => ({ ...prev, startDate: value }));
    localStorage.setItem(STARTDATE_LS, value?.format(DATE_FORMAT) ?? "");
  };

  const handleEndDate = (value: Dayjs | null) => {
    setLocalRequestData((prev) => ({ ...prev, endDate: value }));
    localStorage.setItem(ENDDATE_LS, value?.format(DATE_FORMAT) ?? "");
  };

  useEffect(() => {
    setOwner(localStorage.getItem(OWNER_LS) ?? "");
    setRepo(localStorage.getItem(REPO_LS) ?? "");
    setApiKey(localStorage.getItem(APIKEY_LS) ?? "");
    setAuthor(localStorage.getItem(AUTHOR_LS) ?? "");
    const startDate = localStorage.getItem(STARTDATE_LS) ?? dayjs().subtract(1, 'month').startOf('month').format(DATE_FORMAT);
    const endDate = localStorage.getItem(ENDDATE_LS) ?? dayjs().subtract(1, 'month').endOf('month').format(DATE_FORMAT);
    setStartDate(dayjs(startDate));
    setEndDate(dayjs(endDate));
    localStorage.setItem(STARTDATE_LS, startDate);
    localStorage.setItem(ENDDATE_LS, endDate);
    setLocalRequestData((prev) => ({
      ...prev,
      owner: localStorage.getItem(OWNER_LS) ?? "",
      repo: localStorage.getItem(REPO_LS) ?? "",
      apiKey: localStorage.getItem(APIKEY_LS) ?? "",
      author: localStorage.getItem(AUTHOR_LS) ?? "",
      startDate: dayjs(startDate),
      endDate: dayjs(endDate)
    }));
  }, []);

  const searchDisabled = error || !every(values(localRequestData), Boolean);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({
      ...localRequestData,
      startDate: localRequestData.startDate?.format(DATE_FORMAT) ?? "",
      endDate: localRequestData.endDate?.format(DATE_FORMAT) ?? "",
    });
    setOwner(localRequestData.owner);
    setRepo(localRequestData.repo);
    setApiKey(localRequestData.apiKey);
    setAuthor(localRequestData.author);
    setStartDate(localRequestData.startDate);
    setEndDate(localRequestData.endDate);
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <TextField label="Owner" variant="outlined" value={localRequestData.owner} onChange={({ target: { value } }) => handleLocalFieldChange("owner", value, OWNER_LS)} sx={{ flex: 1 }} />
        <TextField label="Repository" variant="outlined" value={localRequestData.repo} onChange={({ target: { value } }) => handleLocalFieldChange("repo", value, REPO_LS)} sx={{ flex: 1 }} />
      </Box>
      <TextField
        label="Github API Key"
        value={localRequestData.apiKey}
        onChange={({ target: { value } }) => handleLocalFieldChange("apiKey", value, APIKEY_LS)}
        type={showPassword ? "text" : "password"}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
      <Autocomplete
        value={localRequestData.author}
        onChange={(_, newValue: string | null) => {
          handleLocalFieldChange("author", newValue ?? "", AUTHOR_LS);
        }}
        onInputChange={(_, newInputValue) => {
          handleLocalFieldChange("author", newInputValue, AUTHOR_LS);
        }}
        freeSolo
        options={availableAuthors}
        renderInput={(params) => <TextField {...params} label="Author" variant="outlined" />}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <DatePicker
          label="From"
          sx={{ flex: 1 }}
          value={localRequestData.startDate}
          onChange={handleStartDate}
          maxDate={localRequestData.endDate ?? undefined}
        />
        <DatePicker
          label="To"
          sx={{ flex: 1 }}
          value={localRequestData.endDate}
          onChange={handleEndDate}
          minDate={localRequestData.startDate ?? undefined}
          onError={(err) => setError(!!err)}
          onAccept={() => setError(false)}
        />
      </Box>
      <Button variant="contained" disabled={searchDisabled} type="submit">SEARCH</Button>
    </Box>
  );
};
