import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Camera,
  CloudRain,
  Car,
  Zap,
  Droplets,
  Flame,
  Construction,
  AlertTriangle,
  ShieldCheck,
  Navigation,
  Clock,
  CheckCircle2,
  Bell,
  Send,
} from "lucide-react";

const issueTypes = [
  {
    id: "flooding",
    label: "Flooding",
    icon: CloudRain,
  },
  {
    id: "road",
    label: "Road Damage",
    icon: Construction,
  },
  {
    id: "power",
    label: "Power Issue",
    icon: Zap,
  },
  {
    id: "water",
    label: "Water Leak",
    icon: Droplets,
  },
  {
    id: "accident",
    label: "Accident",
    icon: Car,
  },
  {
    id: "fire",
    label: "Fire",
    icon: Flame,
  },
];

const demoAlerts = [
  {
    level: "high",
    title: "Waterlogging reported",
    location: "Road R17",
    time: "8 min ago",
    message: "Avoid this road where possible.",
  },
  {
    level: "medium",
    title: "Traffic slowdown",
    location: "Junction J03",
    time: "14 min ago",
    message: "Use an alternate route.",
  },
  {
    level: "info",
    title: "Heavy rainfall expected",
    location: "Zone B",
    time: "Updated 20 min ago",
    message: "Monitor local advisories.",
  },
];

export default function Citizen() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("report");

  const [issue, setIssue] =
    useState("flooding");

  const [description, setDescription] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const submitReport = () => {
    setSubmitted(true);
  };

  return (
    <main className="citizen-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="citizen-header">

        <button
          className="citizen-back"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={19} />
        </button>

        <div className="citizen-brand">
          <span className="citizen-brand-mark">
            N
          </span>

          <div>
            <strong>NERVA</strong>
            <small>Citizen Access</small>
          </div>
        </div>

        <div className="citizen-location">
          <MapPin size={16} />
          Hyderabad
        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="citizen-hero">

        <div className="citizen-hero-icon">
          <ShieldCheck size={34} />
        </div>

        <div>
          <span className="citizen-kicker">
            PUBLIC SAFETY
          </span>

          <h1>
            Your city. Your signal.
          </h1>

          <p>
            Report local problems, receive
            verified alerts and stay informed
            during city incidents.
          </p>
        </div>

      </section>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="citizen-tabs">

        <button
          className={
            activeTab === "report"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("report")
          }
        >
          <Send size={17} />
          Report Issue
        </button>

        <button
          className={
            activeTab === "alerts"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("alerts")
          }
        >
          <Bell size={17} />
          Nearby Alerts
        </button>

        <button
          className={
            activeTab === "routes"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("routes")
          }
        >
          <Navigation size={17} />
          Safe Routes
        </button>

        <button
          className={
            activeTab === "track"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("track")
          }
        >
          <Clock size={17} />
          Track Report
        </button>

      </nav>


      {/* =====================================================
          REPORT ISSUE
      ===================================================== */}

      {activeTab === "report" && (

        <section className="citizen-content">

          <div className="citizen-panel">

            <div className="panel-heading">
              <div>
                <span>
                  CITIZEN REPORT
                </span>

                <h2>
                  What are you seeing?
                </h2>
              </div>

              <span className="unverified-pill">
                Citizen signal
              </span>
            </div>


            <p className="verification-note">
              Reports are treated as
              unverified citizen signals until
              they are checked against nearby
              reports and available city data.
            </p>


            {/* ISSUE TYPES */}

            <div className="issue-grid">

              {issueTypes.map(
                ({
                  id,
                  label,
                  icon: Icon,
                }) => (

                  <button
                    key={id}
                    className={
                      issue === id
                        ? "issue-type selected"
                        : "issue-type"
                    }
                    onClick={() =>
                      setIssue(id)
                    }
                  >
                    <Icon size={22} />
                    <span>{label}</span>
                  </button>

                )
              )}

            </div>


            {/* LOCATION */}

            <div className="citizen-field">

              <label>
                Location
              </label>

              <div className="location-input">
                <MapPin size={18} />

                <input
                  placeholder="Select or enter location"
                />

                <button>
                  Use current location
                </button>
              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="citizen-field">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Briefly describe what you can see..."
              />

            </div>


            {/* PHOTO */}

            <button className="photo-upload">

              <Camera size={22} />

              <div>
                <strong>
                  Add a photo
                </strong>

                <small>
                  Helps verify the report
                </small>
              </div>

            </button>


            <button
              className="submit-citizen-report"
              onClick={submitReport}
            >
              <Send size={18} />
              Submit Report
            </button>


            {submitted && (

              <div className="report-success">

                <CheckCircle2 size={23} />

                <div>
                  <strong>
                    Report received
                  </strong>

                  <p>
                    Signal ID:
                    {" "}
                    <b>NVR-2048</b>
                  </p>

                  <small>
                    Status: Under verification
                  </small>
                </div>

              </div>

            )}

          </div>


          {/* RIGHT SIDE */}

          <aside className="citizen-side-panel">

            <div className="citizen-map-preview">

              <div className="map-grid-effect" />

              <MapPin
                className="map-main-pin"
                size={32}
              />

              <div className="map-status">
                <span />
                Hyderabad public safety map
              </div>

            </div>


            <div className="signal-process">

              <span className="process-label">
                HOW REPORTS ARE USED
              </span>

              <div className="process-step active">
                <i>1</i>
                <div>
                  <strong>
                    Report received
                  </strong>
                  <small>
                    Citizen signal
                  </small>
                </div>
              </div>

              <div className="process-line" />

              <div className="process-step">
                <i>2</i>
                <div>
                  <strong>
                    Verification
                  </strong>
                  <small>
                    Nearby signals + data
                  </small>
                </div>
              </div>

              <div className="process-line" />

              <div className="process-step">
                <i>3</i>
                <div>
                  <strong>
                    City team notified
                  </strong>
                  <small>
                    When action is needed
                  </small>
                </div>
              </div>

              <div className="process-line" />

              <div className="process-step">
                <i>4</i>
                <div>
                  <strong>
                    Status updated
                  </strong>
                  <small>
                    Citizen can track progress
                  </small>
                </div>
              </div>

            </div>

          </aside>

        </section>

      )}


      {/* =====================================================
          ALERTS
      ===================================================== */}

      {activeTab === "alerts" && (

        <section className="citizen-single-panel">

          <div className="citizen-section-title">
            <span>
              LIVE ADVISORIES
            </span>

            <h2>
              Nearby alerts
            </h2>

            <p>
              Public safety information and
              verified city advisories.
            </p>
          </div>


          <div className="public-alert-list">

            {demoAlerts.map(
              (alert, index) => (

                <article
                  key={index}
                  className={
                    `public-alert ${alert.level}`
                  }
                >

                  <div className="alert-symbol">
                    <AlertTriangle size={21} />
                  </div>

                  <div className="alert-info">

                    <div>
                      <strong>
                        {alert.title}
                      </strong>

                      <span>
                        {alert.time}
                      </span>
                    </div>

                    <p>
                      {alert.location}
                    </p>

                    <small>
                      {alert.message}
                    </small>

                  </div>

                </article>

              )
            )}

          </div>

        </section>

      )}


      {/* =====================================================
          SAFE ROUTES
      ===================================================== */}

      {activeTab === "routes" && (

        <section className="citizen-single-panel">

          <div className="citizen-section-title">

            <span>
              PUBLIC NAVIGATION
            </span>

            <h2>
              Safer route guidance
            </h2>

            <p>
              Routes can avoid active
              simulated or verified incident
              areas.
            </p>

          </div>


          <div className="safe-route-card">

            <div className="safe-route-map">

              <div className="route-line" />

              <div className="route-start">
                A
              </div>

              <div className="route-end">
                B
              </div>

              <div className="route-risk">
                <AlertTriangle size={18} />
              </div>

            </div>


            <div className="route-details">

              <span>
                SUGGESTED ROUTE
              </span>

              <h3>
                Avoid R17 waterlogging zone
              </h3>

              <p>
                Alternate route uses the
                eastern corridor and avoids
                the current advisory area.
              </p>

              <button>
                <Navigation size={17} />
                View safer route
              </button>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          TRACK REPORT
      ===================================================== */}

      {activeTab === "track" && (

        <section className="citizen-single-panel">

          <div className="citizen-section-title">

            <span>
              REPORT STATUS
            </span>

            <h2>
              Track your report
            </h2>

          </div>


          <div className="track-card">

            <div className="track-header">

              <div>
                <small>
                  REPORT ID
                </small>

                <strong>
                  NVR-2048
                </strong>
              </div>

              <span>
                Under verification
              </span>

            </div>


            <div className="track-timeline">

              <div className="track-step complete">

                <i>
                  <CheckCircle2 size={17} />
                </i>

                <div>
                  <strong>
                    Report received
                  </strong>

                  <small>
                    10:24 AM
                  </small>
                </div>

              </div>


              <div className="track-connector complete" />


              <div className="track-step current">

                <i>
                  <Clock size={17} />
                </i>

                <div>
                  <strong>
                    Under verification
                  </strong>

                  <small>
                    Comparing nearby signals
                  </small>
                </div>

              </div>


              <div className="track-connector" />


              <div className="track-step">

                <i>3</i>

                <div>
                  <strong>
                    Department review
                  </strong>

                  <small>
                    Pending
                  </small>
                </div>

              </div>


              <div className="track-connector" />


              <div className="track-step">

                <i>4</i>

                <div>
                  <strong>
                    Resolved
                  </strong>

                  <small>
                    Pending
                  </small>
                </div>

              </div>

            </div>

          </div>

        </section>

      )}

    </main>
  );
}