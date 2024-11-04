import { Dashboard } from "./dashboard/dashboard.tsx";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DashboardContextProvider } from "./dashboard/context/DashboardContextProvider.tsx";

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DashboardContextProvider>
          <Dashboard />
        </DashboardContextProvider>
      </LocalizationProvider>
    </>
  );
}

export default App;
