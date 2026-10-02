import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  signup
} from "../services/api";


export default function Signup() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  function update(event) {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);

      await signup({
        name: form.name,
        email: form.email,
        password: form.password,

        // Public registration is
        // always Citizen Access.
        role: "citizen",
      });

      navigate(
        "/login",
        { replace: true }
      );

    } catch (err) {
      setError(
        err.response?.data?.detail
        || "Unable to create account."
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="auth-page">
      <section className="auth-card">

        <span className="eyebrow">
          CITIZEN ACCESS
        </span>

        <h1>
          Join NERVA.
        </h1>

        <p>
          Create a citizen account to
          view city alerts, report local
          issues and track your reports.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <label>
            Name

            <input
              name="name"
              value={form.name}
              onChange={update}
              autoComplete="name"
              required
            />
          </label>


          <label>
            Email

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              autoComplete="email"
              required
            />
          </label>


          <label>
            Password

            <input
              name="password"
              type="password"
              minLength="6"
              value={form.password}
              onChange={update}
              autoComplete="new-password"
              required
            />
          </label>


          <div className="access-info">
            <span>
              Account type
            </span>

            <strong>
              Citizen Access
            </strong>

            <p>
              Government and Field Team
              accounts are issued separately
              by authorized administrators.
            </p>
          </div>


          {error && (
            <p className="error-text">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="primary-button wide"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Citizen Account"}
          </button>

        </form>


        <p className="auth-switch">
          Already registered?

          {" "}

          <Link to="/login">
            Sign in
          </Link>
        </p>

      </section>
    </main>
  );
}