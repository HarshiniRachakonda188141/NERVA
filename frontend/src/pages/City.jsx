
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  CloudRain,
  Layers3,
  Network,
  RefreshCw,
  ScanLine,
  Users,
  Wind,
  XCircle,
} from "lucide-react";

import BottomNav
  from "../components/BottomNav";

import CityNetwork
  from "../components/CityNetwork";

import AssetSheet
  from "../components/AssetSheet";

import CommandIntelligence from "../components/CommandIntelligence";

import {
  getAssets,
  getCitizenReports,
  getCitizenSignalSummary,
  getAllTasks,
  getWeatherSummary,
  verifyTask,
} from "../services/api";


/*
  Demonstration map centre.

  This coordinate is used only for the
  prototype weather/map experience.

  NERVA modelled infrastructure should
  not be interpreted as verified
  real-world infrastructure.
*/
const DEMO_MAP_CENTER = {
  latitude: 17.441,
  longitude: 78.462,
};


export default function City() {
  const navigate =
    useNavigate();

  const [mode, setMode] =
    useState("surface");

  const [assets, setAssets] =
    useState([]);

  const [
    selectedAsset,
    setSelectedAsset,
  ] = useState(null);


  // ------------------------------------------------
  // RESPONSE / MAP DATA
  // ------------------------------------------------

  const [reports, setReports] =
    useState([]);

  const [signals, setSignals] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [weather, setWeather] =
    useState(null);


  // ------------------------------------------------
  // RESPONSE CENTER STATE
  // ------------------------------------------------

  const [
    responseOpen,
    setResponseOpen,
  ] = useState(false);

  const [
    responseTab,
    setResponseTab,
  ] = useState("signals");

  const [
    loadingResponse,
    setLoadingResponse,
  ] = useState(false);

  const [
    responseError,
    setResponseError,
  ] = useState("");

  const [
    updatingTask,
    setUpdatingTask,
  ] = useState(null);

  const [
    weatherError,
    setWeatherError,
  ] = useState("");


  // ------------------------------------------------
  // CITY ASSETS
  // ------------------------------------------------

  useEffect(() => {
    getAssets()
      .then((data) => {
        setAssets(
          Array.isArray(
            data?.assets
          )
            ? data.assets
            : []
        );
      })
      .catch(
        console.error
      );
  }, []);


  // ------------------------------------------------
  // WEATHER DATA
  // ------------------------------------------------

  async function loadWeather() {
    try {
      setWeatherError("");

      const data =
        await getWeatherSummary(
          DEMO_MAP_CENTER.latitude,
          DEMO_MAP_CENTER.longitude
        );

      setWeather(data);

    } catch (error) {
      console.error(
        "Unable to load weather:",
        error
      );

      setWeather(null);

      setWeatherError(
        "Weather unavailable"
      );
    }
  }


  useEffect(() => {
    loadWeather();
  }, []);


  // ------------------------------------------------
  // RESPONSE CENTER DATA
  // ------------------------------------------------

  async function loadResponseCenter() {
    try {
      setLoadingResponse(true);
      setResponseError("");

      const [
        reportsData,
        signalsData,
        tasksData,
      ] = await Promise.all([
        getCitizenReports(),
        getCitizenSignalSummary(),
        getAllTasks(),
      ]);


      setReports(
        Array.isArray(
          reportsData?.reports
        )
          ? reportsData.reports
          : []
      );


      setSignals(
        Array.isArray(
          signalsData?.clusters
        )
          ? signalsData.clusters
          : []
      );


      setTasks(
        Array.isArray(
          tasksData?.tasks
        )
          ? tasksData.tasks
          : []
      );

    } catch (error) {
      setResponseError(
        error.response?.data?.detail ||
        "Unable to load response data."
      );

    } finally {
      setLoadingResponse(false);
    }
  }


  useEffect(() => {
    loadResponseCenter();
  }, []);


  // ------------------------------------------------
  // ASSET SELECTION
  // ------------------------------------------------

  function selectAsset(
    assetId
  ) {
    const asset =
      assets.find(
        (item) =>
          item.id === assetId
      );

    if (asset) {
      setSelectedAsset(
        asset
      );
    }
  }


  // ------------------------------------------------
  // VERIFY FIELD WORK
  // ------------------------------------------------

  async function handleVerification(
    taskId,
    approved
  ) {
    try {
      setUpdatingTask(
        taskId
      );

      setResponseError("");

      const note =
        approved
          ? (
              "Completion verified " +
              "by City Command."
            )
          : (
              "Completion requires " +
              "additional field work."
            );

      const data =
        await verifyTask(
          taskId,
          approved,
          note
        );


      setTasks(
        (currentTasks) =>
          currentTasks.map(
            (task) =>
              task.id === taskId
                ? data.task
                : task
          )
      );

    } catch (error) {
      setResponseError(
        error.response?.data?.detail ||
        "Unable to verify task."
      );

    } finally {
      setUpdatingTask(
        null
      );
    }
  }


  // ------------------------------------------------
  // CITY VIEW MODES
  // ------------------------------------------------

  const controls = [
    {
      id: "surface",
      label: "Surface",
      icon: Layers3,
    },
    {
      id: "xray",
      label: "X-Ray",
      icon: ScanLine,
    },
    {
      id: "neural",
      label: "Neural",
      icon: Network,
    },
  ];


  // ------------------------------------------------
  // RESPONSE METRICS
  // ------------------------------------------------

  const possibleIncidents =
    signals.filter(
      (signal) =>
        signal.signal_count >= 3
    );


  const activeTasks =
    tasks.filter(
      (task) =>
        task.status !==
        "Resolved"
    );


  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    );


  const resolvedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Resolved"
    );


  // ------------------------------------------------
  // MAP DATA
  // ------------------------------------------------

  const mappedReports =
    reports.filter(
      (report) =>
        Number.isFinite(
          Number(
            report.latitude
          )
        ) &&
        Number.isFinite(
          Number(
            report.longitude
          )
        )
    );


  const mappedTasks =
    tasks.filter(
      (task) =>
        Number.isFinite(
          Number(
            task.latitude
          )
        ) &&
        Number.isFinite(
          Number(
            task.longitude
          )
        )
    );


  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <main className="app-shell">

      {/* -----------------------------------------
          HEADER
      ----------------------------------------- */}

      <header className="floating-header">

        <div>
          <span className="brand-mini">
            NERVA CITY
          </span>

          <p>
            Zone A · Living model
          </p>
        </div>


        {/* WEATHER STATUS */}

        <div className="city-weather-chip">

          {weather ? (
            <>
              <CloudRain
                size={15}
              />

              <div>
                <strong>
                  {
                    weather.temperature ??
                    "--"
                  }
                  °C
                </strong>

                <span>
                  {
                    weather.precipitation ??
                    0
                  }
                  {" mm"}
                </span>
              </div>

              <div>
                <Wind
                  size={13}
                />

                <span>
                  {
                    weather.windSpeed ??
                    "--"
                  }
                  {" km/h"}
                </span>
              </div>
            </>
          ) : (
            <span>
              {
                weatherError ||
                "Loading weather..."
              }
            </span>
          )}

        </div>


        <div className="view-switcher">

          {controls.map(
            ({
              id,
              label,
              icon: Icon,
            }) => (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setMode(id)
                }
                className={
                  mode === id
                    ? "active"
                    : ""
                }
              >
                <Icon size={15} />

                {label}
              </button>
            )
          )}

        </div>

      </header>


      {/* -----------------------------------------
          CITY MODEL
      ----------------------------------------- */}

      <section className="city-page">

        <CityNetwork
          mode={mode}
          activeNodes={[]}
          onNodeClick={
            selectAsset
          }
          citizenReports={
            mappedReports
          }
          fieldTasks={
            mappedTasks
          }
          weather={weather}
        />


        {!selectedAsset && (
          <div className="city-hint">

            <span className="eyebrow">
              {mode.toUpperCase()}
              {" MODE"}
            </span>

            <strong>
              Tap an infrastructure
              node.
            </strong>

          </div>
        )}


        <AssetSheet
          asset={selectedAsset}
          onClose={() =>
            setSelectedAsset(
              null
            )
          }
          onSimulate={() =>
            navigate(
              "/command/nerva"
            )
          }
        />
        <div className="city-command-overlay">
          <CommandIntelligence
               citizenSignals={reports.length}
                activeTasks={activeTasks.length}
                weather={weather}
             />
            </div>


        {/* ---------------------------------------
            RESPONSE CENTER BUTTON
        --------------------------------------- */}

        <button
          type="button"
          className="response-center-trigger"
          onClick={() => {
            setResponseOpen(
              (current) =>
                !current
            );

            if (!responseOpen) {
              loadResponseCenter();
            }
          }}
        >
          <AlertTriangle
            size={18}
          />

          <span>
            Response Center
          </span>

          {possibleIncidents.length >
            0 && (
            <strong>
              {
                possibleIncidents.length
              }
            </strong>
          )}

          {responseOpen ? (
            <ChevronDown
              size={17}
            />
          ) : (
            <ChevronUp
              size={17}
            />
          )}
        </button>


        {/* ---------------------------------------
            RESPONSE CENTER PANEL
        --------------------------------------- */}

        {responseOpen && (
          <aside className="response-center">

            <div className="response-center-header">

              <div>
                <span className="eyebrow">
                  CITY OPERATIONS
                </span>

                <h2>
                  Response Center
                </h2>
              </div>


              <button
                type="button"
                onClick={
                  loadResponseCenter
                }
                disabled={
                  loadingResponse
                }
              >
                <RefreshCw
                  size={16}
                />
              </button>

            </div>


            {/* SUMMARY */}

            <div className="response-summary">

              <div>
                <Users
                  size={17}
                />

                <strong>
                  {reports.length}
                </strong>

                <span>
                  Citizen Signals
                </span>
              </div>


              <div>
                <AlertTriangle
                  size={17}
                />

                <strong>
                  {
                    possibleIncidents.length
                  }
                </strong>

                <span>
                  Emerging
                </span>
              </div>


              <div>
                <ClipboardList
                  size={17}
                />

                <strong>
                  {activeTasks.length}
                </strong>

                <span>
                  Active Tasks
                </span>
              </div>


              <div>
                <CheckCircle2
                  size={17}
                />

                <strong>
                  {resolvedTasks.length}
                </strong>

                <span>
                  Resolved
                </span>
              </div>

            </div>


            {/* TABS */}

            <div className="response-tabs">

              <button
                type="button"
                className={
                  responseTab ===
                  "signals"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setResponseTab(
                    "signals"
                  )
                }
              >
                Signals
              </button>


              <button
                type="button"
                className={
                  responseTab ===
                  "tasks"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setResponseTab(
                    "tasks"
                  )
                }
              >
                Field Work

                {completedTasks.length >
                  0 && (
                  <span>
                    {
                      completedTasks.length
                    }
                  </span>
                )}
              </button>

            </div>


            {responseError && (
              <div className="response-error">

                <AlertTriangle
                  size={15}
                />

                {responseError}

              </div>
            )}


            {loadingResponse && (
              <p className="response-loading">
                Syncing response data...
              </p>
            )}


            {/* -----------------------------------
                CITIZEN SIGNALS
            ----------------------------------- */}

            {!loadingResponse &&
              responseTab ===
                "signals" && (

              <div className="response-list">

                {signals.length ===
                  0 && (
                  <div className="response-empty">
                    No citizen signals
                    reported yet.
                  </div>
                )}


                {signals.map(
                  (
                    signal,
                    index
                  ) => (

                    <article
                      key={
                        `${signal.category}-${signal.location}-${index}`
                      }
                      className={
                        signal.signal_count >=
                        3
                          ? (
                              "response-item " +
                              "emerging"
                            )
                          : "response-item"
                      }
                    >

                      <div className="response-item-top">

                        <div>
                          <span>
                            {
                              signal.category
                            }
                          </span>

                          <h3>
                            {
                              signal.location
                            }
                          </h3>
                        </div>


                        <strong>
                          {
                            signal.signal_count
                          }
                          {" signal"}

                          {
                            signal.signal_count !==
                            1
                              ? "s"
                              : ""
                          }
                        </strong>

                      </div>


                      <p>
                        {
                          signal.classification
                        }
                      </p>


                      <small>
                        Unverified citizen
                        information — review
                        required before treating
                        it as a confirmed
                        incident.
                      </small>

                    </article>
                  )
                )}

              </div>
            )}


            {/* -----------------------------------
                FIELD OPERATIONS
            ----------------------------------- */}

            {!loadingResponse &&
              responseTab ===
                "tasks" && (

              <div className="response-list">

                {tasks.length ===
                  0 && (
                  <div className="response-empty">
                    No field tasks have
                    been assigned yet.
                  </div>
                )}


                {tasks.map(
                  (task) => (

                    <article
                      key={task.id}
                      className="response-item"
                    >

                      <div className="response-item-top">

                        <div>
                          <span>
                            {task.id}
                          </span>

                          <h3>
                            {task.title}
                          </h3>
                        </div>


                        <strong>
                          {task.progress}%
                        </strong>

                      </div>


                      <p>
                        {task.department}
                        {" • "}
                        {task.team}
                      </p>


                      <div className="response-task-progress">

                        <div
                          style={{
                            width:
                              `${task.progress}%`,
                          }}
                        />

                      </div>


                      <div className="response-task-status">

                        <span>
                          {task.status}
                        </span>

                        {task.overdue && (
                          <strong>
                            Overdue
                          </strong>
                        )}

                      </div>


                      {task.status ===
                        "Completed" && (

                        <div className="response-verification">

                          <span>
                            Field Team reports
                            this work as complete.
                          </span>


                          <div>

                            <button
                              type="button"
                              disabled={
                                updatingTask ===
                                task.id
                              }
                              onClick={() =>
                                handleVerification(
                                  task.id,
                                  true
                                )
                              }
                            >
                              <CheckCircle2
                                size={15}
                              />

                              Verify
                            </button>


                            <button
                              type="button"
                              disabled={
                                updatingTask ===
                                task.id
                              }
                              onClick={() =>
                                handleVerification(
                                  task.id,
                                  false
                                )
                              }
                            >
                              <XCircle
                                size={15}
                              />

                              Send Back
                            </button>

                          </div>

                        </div>
                      )}

                    </article>
                  )
                )}

              </div>
            )}


            <div className="response-disclaimer">
              Citizen reports are signals,
              not verified facts. Simulation
              outputs remain modelled
              decision-support information.
            </div>

          </aside>
        )}

      </section>


      <BottomNav />

    </main>
  );
}