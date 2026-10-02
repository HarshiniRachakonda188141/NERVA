import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  LoaderCircle,
  Radio,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import BottomNav
  from "../components/BottomNav";

import {
  getCitizenSignalSummary,
  getCitizenReports,
  getTaskSummary,
  getTasks,
} from "../services/api";


export default function Report() {
  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    signalSummary,
    setSignalSummary,
  ] = useState(null);

  const [
    taskSummary,
    setTaskSummary,
  ] = useState(null);

  const [
    reports,
    setReports,
  ] = useState([]);

  const [
    tasks,
    setTasks,
  ] = useState([]);


  async function loadReport(
    silent = false
  ) {
    try {
      setError("");

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        signalData,
        taskData,
        reportData,
        taskListData,
      ] = await Promise.all([
        getCitizenSignalSummary(),
        getTaskSummary(),
        getCitizenReports(),
        getTasks(),
      ]);

      setSignalSummary(
        signalData || null
      );

      setTaskSummary(
        taskData || null
      );

      setReports(
        Array.isArray(
          reportData?.reports
        )
          ? reportData.reports
          : []
      );

      setTasks(
        Array.isArray(
          taskListData?.tasks
        )
          ? taskListData.tasks
          : []
      );

    } catch (err) {
      console.error(
        "Unable to load command report:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load city intelligence report."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }


  useEffect(() => {
    loadReport();
  }, []);


  const activeTasks =
    tasks.filter(
      (task) =>
        ![
          "Completed",
          "Verified",
          "Resolved",
        ].includes(
          task.status
        )
    );


  const completedTasks =
    tasks.filter(
      (task) =>
        [
          "Completed",
          "Verified",
          "Resolved",
        ].includes(
          task.status
        )
    );


  const openReports =
    reports.filter(
      (report) =>
        ![
          "Resolved",
          "Rejected",
        ].includes(
          report.status
        )
    );


  const verifiedReports =
    reports.filter(
      (report) =>
        report.verified === true ||
        report.completion_verified === true ||
        report.status === "Verified"
    );


  if (loading) {
    return (
      <main className="app-shell">
        <section className="report-page">
          <div className="report-loading">
            <LoaderCircle
              className="spin"
              size={28}
            />

            <span>
              Building city report...
            </span>
          </div>
        </section>

        <BottomNav />
      </main>
    );
  }


  return (
    <main className="app-shell">

      <header className="app-header">
        <div>
          <span className="brand-mini">
            NERVA
          </span>

          <p>
            Command intelligence report
          </p>
        </div>

        <div className="system-online">
          <span />

          LIVE MODEL
        </div>
      </header>


      <section className="report-page">

        <div className="report-command-heading">
          <div>
            <span className="eyebrow">
              CITY INTELLIGENCE
            </span>

            <h1>
              Operational Report
            </h1>

            <p className="report-intro">
              A consolidated view of
              citizen signals, field
              operations and response
              activity.
            </p>
          </div>


          <button
            type="button"
            className="secondary-button"
            disabled={refreshing}
            onClick={() =>
              loadReport(true)
            }
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>


        {error && (
          <div className="response-error">
            <AlertTriangle
              size={16}
            />

            {error}
          </div>
        )}


        <div className="report-metric-grid">

          <div className="report-metric-card">
            <Radio size={19} />

            <span>
              CITIZEN SIGNALS
            </span>

            <strong>
              {reports.length}
            </strong>

            <small>
              Total reports received
            </small>
          </div>


          <div className="report-metric-card">
            <AlertTriangle
              size={19}
            />

            <span>
              OPEN SIGNALS
            </span>

            <strong>
              {openReports.length}
            </strong>

            <small>
              Awaiting resolution
            </small>
          </div>


          <div className="report-metric-card">
            <ClipboardList
              size={19}
            />

            <span>
              ACTIVE TASKS
            </span>

            <strong>
              {activeTasks.length}
            </strong>

            <small>
              Field operations active
            </small>
          </div>


          <div className="report-metric-card">
            <CheckCircle2
              size={19}
            />

            <span>
              COMPLETED
            </span>

            <strong>
              {completedTasks.length}
            </strong>

            <small>
              Completed operations
            </small>
          </div>

        </div>


        <div className="report-section">

          <div className="report-section-heading">
            <div>
              <span className="eyebrow">
                RESPONSE STATUS
              </span>

              <h2>
                City Operations
              </h2>
            </div>

            <Activity size={20} />
          </div>


          <div className="report-summary-grid">

            <div>
              <span>
                Citizen reports
              </span>

              <strong>
                {reports.length}
              </strong>
            </div>


            <div>
              <span>
                Verified signals
              </span>

              <strong>
                {verifiedReports.length}
              </strong>
            </div>


            <div>
              <span>
                Field tasks
              </span>

              <strong>
                {tasks.length}
              </strong>
            </div>


            <div>
              <span>
                Active response
              </span>

              <strong>
                {activeTasks.length}
              </strong>
            </div>

          </div>


          {(signalSummary ||
            taskSummary) && (
            <p className="model-disclaimer">
              Summary values are derived
              from the current NERVA
              prototype API state.
            </p>
          )}

        </div>


        <div className="report-section">

          <div className="report-section-heading">
            <div>
              <span className="eyebrow">
                PUBLIC INPUT
              </span>

              <h2>
                Recent Citizen Signals
              </h2>
            </div>

            <Users size={20} />
          </div>


          <div className="command-report-list">

            {reports.length === 0 && (
              <div className="response-empty">
                No citizen signals have
                been received yet.
              </div>
            )}


            {reports
              .slice(0, 5)
              .map(
                (
                  report,
                  index
                ) => (
                  <div
                    className="command-report-row"
                    key={
                      report.id ||
                      index
                    }
                  >
                    <div className="command-report-index">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>


                    <div className="command-report-main">
                      <strong>
                        {report.category ||
                          "Citizen Signal"}
                      </strong>

                      <span>
                        {report.location_name ||
                          "Location unavailable"}
                      </span>

                      <p>
                        {report.description ||
                          "No description provided."}
                      </p>
                    </div>


                    <span
                      className={
                        `report-status ${
                          String(
                            report.status ||
                            "Submitted"
                          )
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            )
                        }`
                      }
                    >
                      {report.status ||
                        "Submitted"}
                    </span>
                  </div>
                )
              )}

          </div>
        </div>


        <div className="report-section">

          <div className="report-section-heading">
            <div>
              <span className="eyebrow">
                FIELD RESPONSE
              </span>

              <h2>
                Operational Tasks
              </h2>
            </div>

            <ShieldCheck
              size={20}
            />
          </div>


          <div className="command-report-list">

            {tasks.length === 0 && (
              <div className="response-empty">
                No field tasks are
                currently available.
              </div>
            )}


            {tasks
              .slice(0, 6)
              .map(
                (
                  task,
                  index
                ) => (
                  <div
                    className="command-report-row"
                    key={
                      task.id ||
                      index
                    }
                  >
                    <div className="command-report-index">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>


                    <div className="command-report-main">
                      <strong>
                        {task.title ||
                          "Field Task"}
                      </strong>

                      <span>
                        {task.department ||
                          "Department"}

                        {" · "}

                        {task.team ||
                          "Unassigned"}
                      </span>

                      <p>
                        {task.location_name ||
                          task.zone ||
                          "Location unavailable"}
                      </p>
                    </div>


                    <span
                      className={
                        `report-status ${
                          String(
                            task.status ||
                            "Assigned"
                          )
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            )
                        }`
                      }
                    >
                      {task.status ||
                        "Assigned"}
                    </span>
                  </div>
                )
              )}

          </div>
        </div>


        <p className="model-disclaimer">
          NERVA is a prototype
          decision-support environment.
          Displayed operational data may
          include simulated information.
        </p>

      </section>


      <BottomNav />

    </main>
  );
}