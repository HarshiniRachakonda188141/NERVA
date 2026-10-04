import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/Landing";
import CommandLogin from "./pages/CommandLogin";
import CommandDashboard from "./pages/CommandDashboard";
import CityMap from "./pages/CityMap";
import NervaSimulation from "./pages/NervaSimulation";
import OperationsReport from "./pages/OperationsReport";

import FieldLogin from "./pages/FieldLogin";
import FieldTeam from "./pages/FieldTeam";

import Citizen from "./pages/Citizen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC LANDING
        ========================== */}

        <Route
          path="/"
          element={<Landing />}
        />


        {/* =========================
            CITY COMMAND
        ========================== */}

        <Route
          path="/command/login"
          element={<CommandLogin />}
        />

        <Route
          path="/command"
          element={<CommandDashboard />}
        />

        <Route
          path="/command/map"
          element={<CityMap />}
        />

        <Route
          path="/command/city"
          element={
            <Navigate
              to="/command/map"
              replace
            />
          }
        />

        <Route
          path="/command/nerva"
          element={<NervaSimulation />}
        />

        <Route
          path="/command/reports"
          element={<OperationsReport />}
        />


        {/* =========================
            FIELD TEAM
        ========================== */}

        <Route
          path="/field/login"
          element={<FieldLogin />}
        />

        <Route
          path="/field"
          element={<FieldTeam />}
        />


        {/* =========================
            CITIZEN ACCESS
        ========================== */}

        <Route
          path="/citizen"
          element={<Citizen />}
        />


        {/* =========================
            FRIENDLY ROUTES
        ========================== */}

        <Route
          path="/city"
          element={
            <Navigate
              to="/command/map"
              replace
            />
          }
        />

        <Route
          path="/map"
          element={
            <Navigate
              to="/command/map"
              replace
            />
          }
        />

        <Route
          path="/simulation"
          element={
            <Navigate
              to="/command/nerva"
              replace
            />
          }
        />

        <Route
          path="/reports"
          element={
            <Navigate
              to="/command/reports"
              replace
            />
          }
        />

        <Route
          path="/field-team"
          element={
            <Navigate
              to="/field/login"
              replace
            />
          }
        />

        <Route
          path="/report-issue"
          element={
            <Navigate
              to="/citizen"
              replace
            />
          }
        />


        {/* =========================
            UNKNOWN ROUTES
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}