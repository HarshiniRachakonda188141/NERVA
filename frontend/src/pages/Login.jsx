import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import {
  login as loginRequest,
} from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";


export default function Login() {
  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();


  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);


  function redirectByRole(role) {
    switch (role) {
      case "city_command":
        navigate(
          "/pulse",
          {
            replace: true,
          }
        );
        break;

      case "field_team":
        navigate(
          "/field",
          {
            replace: true,
          }
        );
        break;

      case "citizen":
        navigate(
          "/citizen",
          {
            replace: true,
          }
        );
        break;

      default:
        navigate(
          "/",
          {
            replace: true,
          }
        );
    }
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);


      const normalizedEmail =
        email
          .trim()
          .toLowerCase();


      const data =
        await loginRequest({
          email:
            normalizedEmail,

          password,
        });


      if (
        !data?.user ||
        !data?.user?.role
      ) {
        throw new Error(
          "Account role is missing."
        );
      }


      /*
        AuthContext stores both:

        nerva_user
        nerva_token
      */
      login(
        data.user,
        data.token
      );


      redirectByRole(
        data.user.role
      );

    } catch (err) {
      console.error(
        "Login failed:",
        err
      );


      setError(
        err.response
          ?.data
          ?.detail ||
        err.message ||
        "Unable to login."
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="auth-page">

      <div className="auth-orb">
        <span>
          N
        </span>
      </div>


      <section className="auth-card">

        <span className="eyebrow">
          NERVA ACCESS
        </span>


        <h1>
          Welcome back.
        </h1>


        <p>
          Access the NERVA service
          assigned to your account.
        </p>


        <form
          onSubmit={
            handleSubmit
          }
          className="auth-form"
        >

          <label>
            Email

            <input
              type="email"
              value={email}
              autoComplete="email"
              placeholder={
                "name@example.com"
              }
              onChange={(
                event
              ) =>
                setEmail(
                  event
                    .target
                    .value
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
              autoComplete={
                "current-password"
              }
              placeholder={
                "Enter password"
              }
              onChange={(
                event
              ) =>
                setPassword(
                  event
                    .target
                    .value
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
            type="submit"
            className={
              "primary-button wide"
            }
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  className="spin"
                  size={17}
                />

                Entering...
              </>
            ) : (
              <>
                <LockKeyhole
                  size={17}
                />

                Enter NERVA

                <ArrowRight
                  size={17}
                />
              </>
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