import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function CommandLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    department: "",
    employeeId: "",
  });

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     FORM UPDATE
  ========================================================= */

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /* =========================================================
     PROTOTYPE VERIFICATION
  ========================================================= */

  function verifyOfficial() {
    if (verifying || verified) {
      return;
    }

    setVerifying(true);

    window.setTimeout(() => {
      setVerified(true);
      setVerifying(false);
    }, 900);
  }

  /* =========================================================
     ENTER COMMAND
     Prototype mode:
     Credentials are optional.
  ========================================================= */

  function enterCommand(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    const demoUser = {
      name: "City Command Officer",

      email:
        form.email.trim() ||
        "prototype@nerva.local",

      employeeId:
        form.employeeId.trim() ||
        "NERVA-DEMO-01",

      department:
        form.department ||
        "Urban Resilience Command",

      role: "city_command",

      verified: verified,

      prototypeAccess: true,
    };

    localStorage.setItem(
      "nerva_user",
      JSON.stringify(demoUser)
    );

    localStorage.setItem(
      "nerva_role",
      "city_command"
    );

    localStorage.setItem(
      "nerva_command_access",
      "true"
    );

    window.setTimeout(() => {
      navigate("/command");
    }, 450);
  }

  return (
    <main className="command-auth-page">
      <div className="command-auth-grid" />

      <div className="command-auth-glow command-glow-one" />

      <div className="command-auth-glow command-glow-two" />

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <button
        type="button"
        className="command-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Back to NERVA
      </button>

      {/* =====================================================
          AUTH SHELL
      ===================================================== */}

      <section className="command-auth-shell">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div className="command-auth-intro">

          <div className="command-security-badge">
            <ShieldCheck size={18} />
            GOVERNMENT ACCESS
          </div>

          <h1>
            City Command
            <span> Intelligence.</span>
          </h1>

          <p>
            Secure operational access for authorised city
            departments and resilience teams.
          </p>

          {/* =================================================
              VERIFICATION FLOW
          ================================================= */}

          <div className="command-verification-flow">

            <div className="verification-step active">
              <span>01</span>

              <div>
                <strong>
                  Official credentials
                </strong>

                <small>
                  Department and employee identity
                </small>
              </div>
            </div>

            <div
              className={
                verified
                  ? "verification-step active"
                  : "verification-step"
              }
            >
              <span>02</span>

              <div>
                <strong>
                  Authority verification
                </strong>

                <small>
                  Prototype government validation
                </small>
              </div>
            </div>

            <div
              className={
                loading
                  ? "verification-step active"
                  : "verification-step"
              }
            >
              <span>03</span>

              <div>
                <strong>
                  Command access
                </strong>

                <small>
                  Enter the city intelligence workspace
                </small>
              </div>
            </div>

          </div>

          {/* =================================================
              PROTOTYPE NOTE
          ================================================= */}

          <div className="prototype-security-note">
            <FileCheck2 size={20} />

            <div>
              <strong>
                Prototype verification model
              </strong>

              <p>
                Production deployment would validate
                government identity and department
                authorisation through approved systems.
              </p>
            </div>
          </div>

        </div>

        {/* ===================================================
            LOGIN CARD
        =================================================== */}

        <div className="command-login-card">

          <div className="command-card-icon">
            <Building2 size={27} />
          </div>

          <span className="command-eyebrow">
            NERVA SECURE ACCESS
          </span>

          <h2>
            Authorised personnel
          </h2>

          <p className="command-card-copy">
            Enter official credentials or continue using
            prototype access.
          </p>

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={enterCommand} noValidate>

            {/* ===============================================
                EMAIL
            =============================================== */}

            <label className="command-input-label">
              Official email

              <div className="command-input-wrap">
                <Mail size={17} />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="officer@department.gov.in"
                  autoComplete="email"
                />
              </div>
            </label>

            {/* ===============================================
                EMPLOYEE ID
            =============================================== */}

            <label className="command-input-label">
              Employee / Officer ID

              <div className="command-input-wrap">
                <BadgeCheck size={17} />

                <input
                  name="employeeId"
                  type="text"
                  value={form.employeeId}
                  onChange={updateField}
                  placeholder="Enter official ID"
                  autoComplete="off"
                />
              </div>
            </label>

            {/* ===============================================
                DEPARTMENT
            =============================================== */}

            <label className="command-input-label">
              Department

              <div className="command-input-wrap">
                <Building2 size={17} />

                <select
                  name="department"
                  value={form.department}
                  onChange={updateField}
                >
                  <option value="">
                    Select department
                  </option>

                  <option value="GHMC">
                    Municipal Administration
                  </option>

                  <option value="Traffic">
                    Traffic & Mobility
                  </option>

                  <option value="Disaster">
                    Disaster Response
                  </option>

                  <option value="Water">
                    Water & Drainage
                  </option>

                  <option value="Power">
                    Power Infrastructure
                  </option>

                  <option value="Emergency">
                    Emergency Services
                  </option>
                </select>
              </div>
            </label>

            {/* ===============================================
                PASSWORD
            =============================================== */}

            <label className="command-input-label">
              Password

              <div className="command-input-wrap">
                <LockKeyhole size={17} />

                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="Enter secure password"
                  autoComplete="current-password"
                />
              </div>
            </label>

            {/* ===============================================
                VERIFY BUTTON
            =============================================== */}

            {!verified ? (
              <button
                type="button"
                className="verify-government-button"
                onClick={verifyOfficial}
                disabled={verifying || loading}
              >
                {verifying ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="command-spinner"
                    />

                    Verifying authority...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />

                    Verify Government Access
                  </>
                )}
              </button>
            ) : (
              <div className="verification-success">
                <CheckCircle2 size={19} />

                <div>
                  <strong>
                    Prototype verification passed
                  </strong>

                  <small>
                    Demo command access enabled
                  </small>
                </div>
              </div>
            )}

            {/* ===============================================
                ENTER COMMAND
            =============================================== */}

            <button
              type="submit"
              className="enter-command-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="command-spinner"
                  />

                  Opening Command...
                </>
              ) : (
                <>
                  Enter City Command

                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="prototype-access-message">
              Prototype mode: credentials and verification are
              optional for demonstration access.
            </p>

          </form>

        </div>

      </section>
    </main>
  );
}