import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  HardHat,
  IdCard,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function FieldLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    employeeId: "",
    unit: "",
    password: "",
  });

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* =========================================================
     UPDATE FORM
  ========================================================= */

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setVerified(false);
    setMessage("");
  }

  /* =========================================================
     PROTOTYPE VERIFICATION
     Credentials are optional in prototype mode
  ========================================================= */

  function verifyAccess() {
    if (verifying || verified) {
      return;
    }

    setVerifying(true);
    setMessage("");

    window.setTimeout(() => {
      setVerified(true);
      setVerifying(false);

      setMessage(
        "Prototype verification successful. Field access authorised."
      );
    }, 900);
  }

  /* =========================================================
     ENTER FIELD OPERATIONS
     No credentials required for prototype access
  ========================================================= */

  function enterFieldOperations(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    const fieldUser = {
      name: "Field Response Officer",

      email:
        form.email.trim() ||
        "field.prototype@nerva.local",

      employeeId:
        form.employeeId.trim() ||
        "NERVA-FIELD-DEMO-01",

      unit:
        form.unit ||
        "Prototype Response Unit",

      role: "field_team",

      verified,

      prototypeAccess: true,
    };

    sessionStorage.setItem(
      "nervaFieldAccess",
      "verified"
    );

    sessionStorage.setItem(
      "nervaFieldUser",
      JSON.stringify(fieldUser)
    );

    localStorage.setItem(
      "nerva_role",
      "field_team"
    );

    window.setTimeout(() => {
      navigate("/field");
    }, 450);
  }

  return (
    <main className="field-login-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="field-login-header">
        <button
          type="button"
          className="field-login-back"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back to NERVA
        </button>

        <div className="field-login-status">
          <span />
          SECURE RESPONSE NETWORK
        </div>
      </header>

      <div className="field-login-shell">
        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <motion.section
          className="field-login-intro"
          initial={{
            opacity: 0,
            x: -25,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.55,
          }}
        >
          <div className="field-login-badge">
            <ShieldCheck size={16} />
            FIELD TEAM ACCESS
          </div>

          <h1>
            Field Response
            <span> Intelligence.</span>
          </h1>

          <p className="field-login-description">
            Secure operational access for authorised response
            personnel receiving NERVA incident assignments.
          </p>

          {/* =================================================
              ACCESS STEPS
          ================================================= */}

          <div className="field-login-steps">
            <LoginStep
              number="01"
              icon={IdCard}
              title="Personnel credentials"
              description="Employee and response-team identity"
              active={!verified && !loading}
            />

            <LoginStep
              number="02"
              icon={UserCheck}
              title="Identity verification"
              description="Prototype field authority validation"
              active={verified && !loading}
            />

            <LoginStep
              number="03"
              icon={HardHat}
              title="Response access"
              description="Enter assigned field operations"
              active={loading}
            />
          </div>

          {/* =================================================
              PROTOTYPE NOTE
          ================================================= */}

          <div className="field-login-notice">
            <BadgeCheck size={21} />

            <div>
              <strong>
                Prototype verification model
              </strong>

              <p>
                Production deployment would validate
                personnel identity, department assignment
                and operational authority through approved
                government systems.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <motion.section
          className="field-login-card"
          initial={{
            opacity: 0,
            x: 25,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.55,
            delay: 0.08,
          }}
        >
          <div className="field-login-icon">
            <HardHat size={27} />
          </div>

          <span className="field-login-eyebrow">
            NERVA FIELD ACCESS
          </span>

          <h2>
            Authorised personnel
          </h2>

          <p className="field-login-subtitle">
            Enter official credentials or continue using
            prototype access.
          </p>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="field-login-form"
            onSubmit={enterFieldOperations}
            noValidate
          >
            {/* ===============================================
                EMAIL
            =============================================== */}

            <label htmlFor="field-email">
              Official email
            </label>

            <div className="field-input">
              <Mail size={18} />

              <input
                id="field-email"
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder="responder@department.gov.in"
                autoComplete="email"
              />
            </div>

            {/* ===============================================
                EMPLOYEE ID
            =============================================== */}

            <label htmlFor="field-employee-id">
              Employee / Responder ID
            </label>

            <div className="field-input">
              <IdCard size={18} />

              <input
                id="field-employee-id"
                type="text"
                name="employeeId"
                value={form.employeeId}
                onChange={updateField}
                placeholder="Enter official ID"
                autoComplete="off"
              />
            </div>

            {/* ===============================================
                RESPONSE UNIT
            =============================================== */}

            <label htmlFor="field-unit">
              Response unit
            </label>

            <div className="field-input">
              <Building2 size={18} />

              <select
                id="field-unit"
                name="unit"
                value={form.unit}
                onChange={updateField}
              >
                <option value="">
                  Select response unit
                </option>

                <option value="disaster-response">
                  Disaster Response
                </option>

                <option value="municipal-field">
                  Municipal Field Operations
                </option>

                <option value="traffic-response">
                  Traffic Response
                </option>

                <option value="emergency-services">
                  Emergency Services
                </option>

                <option value="drainage">
                  Drainage & Water Management
                </option>
              </select>
            </div>

            {/* ===============================================
                PASSWORD
            =============================================== */}

            <label htmlFor="field-password">
              Password
            </label>

            <div className="field-input">
              <LockKeyhole size={18} />

              <input
                id="field-password"
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                placeholder="Enter secure password"
                autoComplete="current-password"
              />
            </div>

            {/* ===============================================
                VERIFICATION MESSAGE
            =============================================== */}

            {message && (
              <motion.div
                className={
                  verified
                    ? "field-login-message success"
                    : "field-login-message"
                }
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                {verified && (
                  <ShieldCheck size={16} />
                )}

                {message}
              </motion.div>
            )}

            {/* ===============================================
                VERIFY BUTTON
            =============================================== */}

            <button
              type="button"
              className={
                verified
                  ? "field-verify-button verified"
                  : "field-verify-button"
              }
              onClick={verifyAccess}
              disabled={
                verifying ||
                loading
              }
            >
              {verifying ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="command-spinner"
                  />

                  Verifying Field Access...
                </>
              ) : verified ? (
                <>
                  <ShieldCheck size={18} />

                  Field Access Verified
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />

                  Verify Field Access
                </>
              )}
            </button>

            {/* ===============================================
                ENTER FIELD OPERATIONS
            =============================================== */}

            <button
              type="submit"
              className="field-enter-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="command-spinner"
                  />

                  Opening Operations...
                </>
              ) : (
                <>
                  Enter Field Operations

                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <p className="field-login-footer">
            Prototype mode: credentials and verification are
            optional for demonstration access.
          </p>
        </motion.section>
      </div>
    </main>
  );
}

/* =========================================================
   LOGIN STEP
========================================================= */

function LoginStep({
  number,
  icon: Icon,
  title,
  description,
  active,
}) {
  return (
    <div
      className={
        active
          ? "field-login-step active"
          : "field-login-step"
      }
    >
      <div className="field-step-number">
        {number}
      </div>

      <Icon size={19} />

      <div>
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>
    </div>
  );
}