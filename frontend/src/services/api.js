import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});


export async function getAssets() {
  const response = await api.get(
    "/api/assets"
  );

  return response.data;
}


export async function runSimulation(
  scenarioId = "RAIN_01"
) {
  const response = await api.post(
    "/api/simulate",
    {
      scenario_id: scenarioId
    }
  );

  return response.data;
}


export async function signup(payload) {
  const response = await api.post(
    "/api/auth/signup",
    payload
  );

  return response.data;
}


export async function login(payload) {
  const response = await api.post(
    "/api/auth/login",
    payload
  );

  return response.data;
}


export async function runIntervention(
  scenarioId = "RAIN_01",
  intervention = "CLEAR_DRAIN"
) {
  const response = await api.post(
    "/api/intervene",
    {
      scenario_id: scenarioId,
      intervention
    }
  );

  return response.data;
}


export default api;