import {
  AlertCircle,
  ArrowRight,
  MapPin,
  MessageSquareWarning,
  Radio,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


export default function CitizenSignals({
  summary = null,
  reports = [],
}) {
  const navigate =
    useNavigate();


  const totalReports =
    summary?.total_reports ??
    reports.length ??
    0;


  const verifiedReports =
    summary?.verified_reports ??
    reports.filter(
      (report) =>
        report.verified === true ||
        report.verification_status ===
          "Verified"
    ).length;


  const pendingReports =
    summary?.pending_reports ??
    reports.filter(
      (report) =>
        !report.verified &&
        report.status !== "Resolved"
    ).length;


  const highPriorityReports =
    reports.filter(
      (report) =>
        report.priority === "Critical" ||
        report.priority === "High"
    ).length;


  const recentReports =
    reports.slice(0, 3);


  function openReports() {
    navigate("/citizen-report");
  }


  return (
    <section className="citizen-signals-panel">
      <div className="citizen-signals-header">
        <div>
          <span className="citizen-signals-eyebrow">
            HUMAN SENSOR NETWORK
          </span>

          <h2>
            Citizen Signal Intelligence
          </h2>

          <p>
            Citizen observations provide an
            additional evidence layer for
            identifying emerging urban issues.
          </p>
        </div>

        <div className="citizen-signal-live">
          <Radio size={14} />

          SIGNAL LAYER
        </div>
      </div>


      <div className="citizen-signal-metrics">
        <article>
          <div className="citizen-metric-icon">
            <Users size={18} />
          </div>

          <div>
            <strong>
              {totalReports}
            </strong>

            <span>
              Total Reports
            </span>
          </div>
        </article>


        <article>
          <div className="citizen-metric-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <strong>
              {verifiedReports}
            </strong>

            <span>
              Verified
            </span>
          </div>
        </article>


        <article>
          <div className="citizen-metric-icon">
            <MessageSquareWarning
              size={18}
            />
          </div>

          <div>
            <strong>
              {pendingReports}
            </strong>

            <span>
              Under Review
            </span>
          </div>
        </article>


        <article>
          <div className="citizen-metric-icon">
            <AlertCircle size={18} />
          </div>

          <div>
            <strong>
              {highPriorityReports}
            </strong>

            <span>
              Priority Signals
            </span>
          </div>
        </article>
      </div>


      <div className="citizen-signal-content">
        <div className="citizen-signal-analysis">
          <span className="citizen-analysis-label">
            SIGNAL INTERPRETATION
          </span>

          {totalReports > 0 ? (
            <>
              <strong>
                Citizen observations are
                contributing to the current
                city intelligence picture.
              </strong>

              <p>
                Reports should be verified
                against infrastructure,
                field-team and environmental
                evidence before operational
                decisions are made.
              </p>
            </>
          ) : (
            <>
              <strong>
                No citizen signal has been
                received yet.
              </strong>

              <p>
                New citizen reports will
                appear here as an additional
                situational-awareness layer.
              </p>
            </>
          )}

          <div className="citizen-analysis-note">
            <ShieldCheck size={15} />

            <span>
              Citizen reports are supporting
              evidence and are not treated as
              automatically verified incidents.
            </span>
          </div>
        </div>


        <div className="citizen-recent-reports">
          <div className="citizen-recent-heading">
            <span>
              RECENT SIGNALS
            </span>

            <strong>
              {recentReports.length}
            </strong>
          </div>


          {recentReports.length > 0 ? (
            <div className="citizen-report-mini-list">
              {recentReports.map(
                (report, index) => (
                  <article
                    className="citizen-report-mini"
                    key={
                      report.id ||
                      `report-${index}`
                    }
                  >
                    <div className="citizen-report-mini-icon">
                      <MapPin size={16} />
                    </div>

                    <div>
                      <span>
                        {report.category ||
                          "Citizen Report"}
                      </span>

                      <strong>
                        {report.location_name ||
                          report.location ||
                          "Location reported"}
                      </strong>

                      <small>
                        {report.status ||
                          "Received"}
                      </small>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="citizen-empty-signals">
              <MessageSquareWarning
                size={22}
              />

              <span>
                Waiting for citizen
                observations.
              </span>
            </div>
          )}
        </div>
      </div>


      <div className="citizen-signals-footer">
        <div>
          <span className="citizen-signal-dot" />

          <p>
            Citizen layer connected to
            NERVA Command Intelligence
          </p>
        </div>

        <button
          type="button"
          onClick={openReports}
        >
          Review Reports

          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}