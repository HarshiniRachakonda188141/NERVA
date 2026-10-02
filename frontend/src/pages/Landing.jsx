import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  HardHat,
  MapPin,
  CloudRain,
  Droplets,
  Zap,
  Bus,
  Hospital,
  Radio,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const goToCommand = () => {
    navigate("/login?role=command");
  };

  const goToField = () => {
    navigate("/login?role=field");
  };

  const goToCitizen = () => {
    navigate("/citizen");
  };

  return (
    <main className="nerva-landing">
      {/* Animated background */}
      <div className="landing-bg" />
      <div className="landing-overlay" />
      <div className="landing-grid" />
      <div className="landing-scan" />

      {/* Infrastructure signals */}
      <div className="signal signal-rain">
        <CloudRain size={18} />
        <span>Rainfall Monitoring</span>
      </div>

      <div className="signal signal-drain">
        <Droplets size={18} />
        <span>Drainage System</span>
      </div>

      <div className="signal signal-power">
        <Zap size={18} />
        <span>Power Network</span>
      </div>

      <div className="signal signal-hospital">
        <Hospital size={18} />
        <span>Critical Services</span>
      </div>

      <div className="signal signal-transit">
        <Bus size={18} />
        <span>Public Transport</span>
      </div>

      <div className="signal signal-citizen">
        <Radio size={18} />
        <span>Citizen Signals</span>
      </div>

      {/* Location */}
      <div className="landing-location">
        <MapPin size={17} />
        <span>Hyderabad</span>
      </div>

      {/* Main content */}
      <section className="landing-center">
        <div className="landing-eyebrow">
          URBAN RESILIENCE INTELLIGENCE
        </div>

        <h1 className="nerva-logo">
          NERVA
        </h1>

        <p className="nerva-fullname">
          Neural Engine for Resilient Virtual Assets
        </p>

        <div className="landing-pulse-line">
          <span />
          <i />
          <span />
        </div>

        <h2 className="landing-tagline">
          Predict. Prevent. Coordinate.
        </h2>

        <p className="landing-subtitle">
          A digital nervous system for safer, smarter and more resilient cities.
        </p>

        <div className="landing-status">
          <span className="status-dot" />
          City intelligence online
        </div>

        {/* Access cards */}
        <div className="access-grid">
          <button
            className="access-card command-card"
            onClick={goToCommand}
          >
            <div className="access-icon">
              <Building2 size={28} />
            </div>

            <div>
              <strong>City Command</strong>
              <small>
                Government & authorised officials
              </small>
            </div>

            <ArrowRight className="access-arrow" size={20} />
          </button>

          <button
            className="access-card field-card"
            onClick={goToField}
          >
            <div className="access-icon">
              <HardHat size={28} />
            </div>

            <div>
              <strong>Field Team</strong>
              <small>
                Assigned incidents & response operations
              </small>
            </div>

            <ArrowRight className="access-arrow" size={20} />
          </button>

          <button
            className="access-card citizen-card"
            onClick={goToCitizen}
          >
            <div className="access-icon">
              <Users size={28} />
            </div>

            <div>
              <strong>Citizen Access</strong>
              <small>
                Report issues, alerts & public safety
              </small>
            </div>

            <ArrowRight className="access-arrow" size={20} />
          </button>
        </div>

        <div className="landing-footer-note">
          <span>REAL DATA</span>
          <b>•</b>
          <span>DEPENDENCY INTELLIGENCE</span>
          <b>•</b>
          <span>CITIZEN SIGNALS</span>
          <b>•</b>
          <span>COORDINATED RESPONSE</span>
        </div>
      </section>
    </main>
  );
}