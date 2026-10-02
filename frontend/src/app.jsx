import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import City from "./pages/City";
import Pulse from "./pages/Pulse";
import Nerva from "./pages/Nerva";
import Report from "./pages/Report";

import Citizen from "./pages/Citizen";
import FieldTeam from "./pages/FieldTeam";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================
            PUBLIC
        ================================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* ================================
            CITY COMMAND
            Government / authorised users
        ================================= */}

        <Route
          path="/command"
          element={
            <ProtectedRoute
              allowedRoles={["command"]}
            >
              <City />
            </ProtectedRoute>
          }
        />

        <Route
          path="/command/city"
          element={
            <ProtectedRoute
              allowedRoles={["command"]}
            >
              <City />
            </ProtectedRoute>
          }
        />

        <Route
          path="/command/pulse"
          element={
            <ProtectedRoute
              allowedRoles={["command"]}
            >
              <Pulse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/command/nerva"
          element={
            <ProtectedRoute
              allowedRoles={["command"]}
            >
              <Nerva />
            </ProtectedRoute>
          }
        />

        <Route
          path="/command/reports"
          element={
            <ProtectedRoute
              allowedRoles={["command"]}
            >
              <Report />
            </ProtectedRoute>
          }
        />


        {/* ================================
            FIELD TEAM
        ================================= */}

        <Route
          path="/field"
          element={
            <ProtectedRoute
              allowedRoles={["field"]}
            >
              <FieldTeam />
            </ProtectedRoute>
          }
        />


        {/* ================================
            CITIZEN ACCESS
            Public-facing app
        ================================= */}

        <Route
          path="/citizen"
          element={<Citizen />}
        />


        {/* ================================
            OLD ROUTES
        ================================= */}

        <Route
          path="/city"
          element={
            <Navigate
              to="/command/city"
              replace
            />
          }
        />

        <Route
          path="/pulse"
          element={
            <Navigate
              to="/command/pulse"
              replace
            />
          }
        />

        <Route
          path="/nerva"
          element={
            <Navigate
              to="/command/nerva"
              replace
            />
          }
        />

        <Route
          path="/report"
          element={
            <Navigate
              to="/command/reports"
              replace
            />
          }
        />


        {/* ================================
            UNKNOWN URL
        ================================= */}

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

export default App;