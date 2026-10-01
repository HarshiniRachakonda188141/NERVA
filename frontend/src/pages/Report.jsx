import {
  useState
} from "react";

import {
  Camera,
  MapPin,
  Send
} from "lucide-react";

import BottomNav from "../components/BottomNav";

export default function Report() {
  const [description, setDescription] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!description.trim()) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="app-shell">
      <section className="report-page">
        <span className="eyebrow">
          CITIZEN SIGNAL
        </span>

        <h1>
          See something wrong?
        </h1>

        <p className="report-intro">
          Show NERVA what you see.
        </p>

        {!submitted ? (
          <form
            className="report-form"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="upload-area"
            >
              <Camera size={25} />

              <strong>
                Add a photo
              </strong>

              <span>
                Optional in this
                prototype
              </span>
            </button>

            <label>
              What happened?

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Example: Water is overflowing from the drain near the main junction..."
              />
            </label>

            <div className="location-field">
              <MapPin size={18} />

              <div>
                <strong>
                  Zone A
                </strong>

                <span>
                  Simulated location
                </span>
              </div>
            </div>

            <button
              className="primary-button wide"
              type="submit"
            >
              Send to NERVA

              <Send size={17} />
            </button>
          </form>
        ) : (
          <div className="report-success">
            <span className="success-dot" />

            <h2>
              Signal received.
            </h2>

            <p>
              The prototype report has
              been captured for
              infrastructure analysis.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setDescription("");
              }}
              className="secondary-button"
            >
              Report another issue
            </button>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}