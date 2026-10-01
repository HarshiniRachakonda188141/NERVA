import {
  useState
} from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  ArrowRight,
  LockKeyhole
} from "lucide-react";

import {
  login as loginRequest
} from "../services/api";

import {
  useAuth
} from "../context/AuthContext";


export default function Login() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);

      const data =
        await loginRequest({
          email,
          password
        });

      localStorage.setItem(
        "nerva_token",
        data.token
      );

      login(data.user);

      navigate("/pulse");

    } catch (err) {
      setError(
        err.response?.data?.detail
        || "Unable to login."
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="auth-page">
      <div className="auth-orb">
        <span>N</span>
      </div>

      <section className="auth-card">
        <span className="eyebrow">
          NERVA ACCESS
        </span>

        <h1>
          Welcome back.
        </h1>

        <p>
          Enter the city's
          intelligence layer.
        </p>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
            />
          </label>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button
            className="primary-button wide"
            disabled={loading}
          >
            <LockKeyhole
              size={17}
            />

            {loading
              ? "Entering..."
              : "Enter NERVA"}

            {!loading && (
              <ArrowRight
                size={17}
              />
            )}
          </button>
        </form>

        <p className="auth-switch">
          New to NERVA?

          {" "}

          <Link to="/signup">
            Create access
          </Link>
        </p>
      </section>
    </main>
  );
}