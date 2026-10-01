import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pulse from "./pages/Pulse";
import City from "./pages/City";
import Nerva from "./pages/Nerva";
import Report from "./pages/Report";

import ProtectedRoute
  from "./components/ProtectedRoute";


function Secure({
  children
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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

        <Route
          path="/pulse"
          element={
            <Secure>
              <Pulse />
            </Secure>
          }
        />

        <Route
          path="/city"
          element={
            <Secure>
              <City />
            </Secure>
          }
        />

        <Route
          path="/nerva"
          element={
            <Secure>
              <Nerva />
            </Secure>
          }
        />

        <Route
          path="/report"
          element={
            <Secure>
              <Report />
            </Secure>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}