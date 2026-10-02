import axios from "axios";


// ==========================================================
// NERVA API CONFIGURATION
// ==========================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});


// ==========================================================
// AUTH TOKEN
// ==========================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "nerva_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);


// ==========================================================
// ASSETS
// ==========================================================

export async function getAssets() {
  const response = await api.get(
    "/api/assets"
  );

  return response.data;
}


export async function getAsset(
  assetId
) {
  const response = await api.get(
    `/api/assets/${assetId}`
  );

  return response.data;
}


export async function getAssetConnections(
  assetId
) {
  const response = await api.get(
    `/api/assets/${assetId}/connections`
  );

  return response.data;
}


// ==========================================================
// SCENARIOS
// ==========================================================

export async function getScenarios() {
  const response = await api.get(
    "/api/scenarios"
  );

  return response.data;
}


// ==========================================================
// SIMULATION
// ==========================================================

export async function runSimulation(
  scenarioId = "RAIN_01",
  severity = null
) {
  const payload = {
    scenario_id: scenarioId,
  };

  if (severity !== null) {
    payload.severity = severity;
  }

  const response = await api.post(
    "/api/simulate",
    payload
  );

  return response.data;
}


// ==========================================================
// SCENARIO TIMELINE
// ==========================================================

export async function getScenarioTimeline(
  scenarioId
) {
  const response = await api.get(
    `/api/scenarios/${scenarioId}/timeline`
  );

  return response.data;
}


// ==========================================================
// SCENARIO EVIDENCE
// ==========================================================

export async function getScenarioEvidence(
  scenarioId
) {
  const response = await api.get(
    `/api/scenarios/${scenarioId}/evidence`
  );

  return response.data;
}


// ==========================================================
// RESPONSE CENTER
// ==========================================================

export async function getScenarioResponse(
  scenarioId
) {
  const response = await api.get(
    `/api/scenarios/${scenarioId}/response`
  );

  return response.data;
}


// ==========================================================
// AUTHENTICATION
// ==========================================================

export async function signup(
  payload
) {
  const response = await api.post(
    "/api/auth/signup",
    payload
  );

  return response.data;
}


export async function login(
  payload
) {
  const response = await api.post(
    "/api/auth/login",
    payload
  );

  return response.data;
}


export async function getAuthRoles() {
  const response = await api.get(
    "/api/auth/roles"
  );

  return response.data;
}


export async function getDemoAccess() {
  const response = await api.get(
    "/api/auth/demo-access"
  );

  return response.data;
}


// ==========================================================
// INTERVENTIONS
// ==========================================================

export async function getInterventions() {
  const response = await api.get(
    "/api/interventions"
  );

  return response.data;
}


export async function runIntervention(
  scenarioId = "RAIN_01",
  interventions = [
    "CLEAR_DRAIN",
  ]
) {
  const selected =
    Array.isArray(interventions)
      ? interventions
      : [interventions];

  const response = await api.post(
    "/api/intervene",
    {
      scenario_id: scenarioId,
      interventions: selected,
    }
  );

  return response.data;
}


// ==========================================================
// CITIZEN REPORTS
// ==========================================================

export async function createCitizenReport(
  payload
) {
  const response = await api.post(
    "/api/citizen-reports/",
    payload
  );

  return response.data;
}


export async function getCitizenReports() {
  const response = await api.get(
    "/api/citizen-reports/"
  );

  return response.data;
}


export async function getCitizenReport(
  reportId
) {
  const response = await api.get(
    `/api/citizen-reports/${reportId}`
  );

  return response.data;
}


// ==========================================================
// CITIZEN SIGNAL INTELLIGENCE
// ==========================================================

export async function getCitizenSignalSummary() {
  const response = await api.get(
    "/api/citizen-reports/signals/summary"
  );

  return response.data;
}


// ==========================================================
// CITIZEN REPORT STATUS
// ==========================================================

export async function updateCitizenReportStatus(
  reportId,
  payload
) {
  const response = await api.patch(
    `/api/citizen-reports/${reportId}/status`,
    payload
  );

  return response.data;
}


// ==========================================================
// CITIZEN REPORT VERIFICATION
// ==========================================================

export async function verifyCitizenReport(
  reportId,
  payload
) {
  const response = await api.patch(
    `/api/citizen-reports/${reportId}/verify`,
    payload
  );

  return response.data;
}


// ==========================================================
// FIELD TASKS
// ==========================================================

export async function getAllTasks() {
  const response = await api.get(
    "/api/tasks/"
  );

  return response.data;
}


// Alias for components that use getTasks()
export async function getTasks() {
  return getAllTasks();
}


export async function getTask(
  taskId
) {
  const response = await api.get(
    `/api/tasks/${taskId}`
  );

  return response.data;
}


// ==========================================================
// TEAM TASKS
// ==========================================================

export async function getTeamTasks(
  teamName
) {
  const safeTeamName =
    encodeURIComponent(
      teamName
    );

  const response = await api.get(
    `/api/tasks/team/${safeTeamName}/assigned`
  );

  return response.data;
}


// ==========================================================
// DEPARTMENT TASKS
// ==========================================================

export async function getDepartmentTasks(
  departmentName
) {
  const safeDepartment =
    encodeURIComponent(
      departmentName
    );

  const response = await api.get(
    `/api/tasks/department/${safeDepartment}`
  );

  return response.data;
}


// ==========================================================
// TASK SUMMARY
// ==========================================================

export async function getTaskSummary() {
  const response = await api.get(
    "/api/tasks/summary"
  );

  return response.data;
}


// ==========================================================
// CREATE FIELD TASK
// ==========================================================

export async function createTask(
  payload
) {
  const response = await api.post(
    "/api/tasks/",
    payload
  );

  return response.data;
}


// ==========================================================
// UPDATE FIELD TASK
// ==========================================================

export async function updateTaskStatus(
  taskId,
  statusOrPayload,
  note = null,
  evidenceUrl = null
) {
  let payload;

  // Supports:
  // updateTaskStatus(id, { ... })
  //
  // AND:
  // updateTaskStatus(
  //   id,
  //   "Work in Progress",
  //   "note",
  //   null
  // )

  if (
    typeof statusOrPayload === "object" &&
    statusOrPayload !== null
  ) {
    payload = statusOrPayload;
  } else {
    payload = {
      status: statusOrPayload,
      note,
      evidence_url:
        evidenceUrl,
    };
  }

  const response = await api.patch(
    `/api/tasks/${taskId}/status`,
    payload
  );

  return response.data;
}


// ==========================================================
// VERIFY FIELD TASK
// ==========================================================

export async function verifyTask(
  taskId,
  verifiedOrPayload,
  verificationNote = null
) {
  let payload;

  // Supports both object and positional
  // calling styles used by the frontend.

  if (
    typeof verifiedOrPayload === "object" &&
    verifiedOrPayload !== null
  ) {
    payload = verifiedOrPayload;
  } else {
    payload = {
      verified:
        verifiedOrPayload,

      verification_note:
        verificationNote,
    };
  }

  const response = await api.patch(
    `/api/tasks/${taskId}/verify`,
    payload
  );

  return response.data;
}


// ==========================================================
// WEATHER DATA
// ==========================================================

const weatherApi =
  axios.create({
    baseURL:
      "https://api.open-meteo.com/v1",

    timeout: 10000,
  });


export async function getWeatherData(
  latitude,
  longitude
) {
  if (
    latitude == null ||
    longitude == null
  ) {
    throw new Error(
      "Latitude and longitude are required."
    );
  }

  const response =
    await weatherApi.get(
      "/forecast",
      {
        params: {
          latitude,
          longitude,

          current: [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "rain",
            "weather_code",
            "wind_speed_10m",
          ].join(","),

          hourly: [
            "precipitation_probability",
            "precipitation",
            "rain",
          ].join(","),

          forecast_days: 1,

          timezone: "auto",
        },
      }
    );

  return response.data;
}


// ==========================================================
// WEATHER SUMMARY
// ==========================================================

export async function getWeatherSummary(
  latitude,
  longitude
) {
  const data =
    await getWeatherData(
      latitude,
      longitude
    );

  const current =
    data?.current || {};

  const hourly =
    data?.hourly || {};

  const probabilities =
    Array.isArray(
      hourly.precipitation_probability
    )
      ? hourly.precipitation_probability
      : [];

  const numericProbabilities =
    probabilities.filter(
      (value) =>
        typeof value === "number"
    );

  const maximumRainProbability =
    numericProbabilities.length > 0
      ? Math.max(
          ...numericProbabilities
        )
      : null;

  return {
    source:
      "Open-Meteo",

    type:
      "weather_forecast_data",

    latitude:
      data.latitude,

    longitude:
      data.longitude,

    timezone:
      data.timezone,

    temperature:
      current.temperature_2m,

    humidity:
      current.relative_humidity_2m,

    precipitation:
      current.precipitation,

    rain:
      current.rain,

    windSpeed:
      current.wind_speed_10m,

    weatherCode:
      current.weather_code,

    maximumRainProbability,

    observedAt:
      current.time,

    disclaimer: (
      "Weather information comes from " +
      "an external forecast service and " +
      "is separate from NERVA's modelled " +
      "infrastructure simulations."
    ),
  };
}


// ==========================================================
// DEFAULT AXIOS INSTANCE
// ==========================================================

export default api;