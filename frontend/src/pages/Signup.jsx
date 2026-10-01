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
      role: "Municipal"
    });

  const [error, setError] =
    useState("");


  function update(
    event
  ) {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value
    });
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    try {
      setError("");

      await signup(form);

      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.detail
        || "Unable to create account."
      );
    }
  }


  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">
          CREATE ACCESS
        </span>

        <h1>
          Join NERVA.
        </h1>

        <p>
          Prototype department
          access.
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
              required
            />
          </label>

          <label>
            Department

            <select
              name="role"
              value={form.role}
              onChange={update}
            >
              <option>
                Municipal
              </option>

              <option>
                Drainage
              </option>

              <option>
                Traffic
              </option>

              <option>
                Emergency
              </option>

              <option>
                Health
              </option>
            </select>
          </label>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button
            className="primary-button wide"
          >
            Create prototype access
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