import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Building2,
  HardHat,
  Users,
  MapPin,
  CloudRain,
  Droplets,
  Zap,
  Hospital,
  Bus,
  Radio,
  ArrowRight,
} from "lucide-react";

import cityImage from "../assets/hyderabad-nerva.png";


export default function Landing() {
  const navigate = useNavigate();


  /*
    =========================================================
    NERVA ACCESS ROUTES
    =========================================================

    City Command:
    Government / authorised officials
    -> verification + secure login

    Field Team:
    Municipal / emergency / infrastructure employees
    -> employee verification + login

    Citizen:
    Public access
    -> no government verification required
  */

  const accessCards = [
    {
      title: "City Command",
      description:
        "Government & authorised officials",

      icon: Building2,

      className: "command",

      action: () =>
        navigate("/command/login"),
    },

    {
      title: "Field Team",
      description:
        "Assigned incidents & response operations",

      icon: HardHat,

      className: "field",

      action: () =>
        navigate("/field/login"),
    },

    {
      title: "Citizen Access",
      description:
        "Report issues, alerts & public safety",

      icon: Users,

      className: "citizen",

      action: () =>
        navigate("/citizen"),
    },
  ];


  return (
    <main
      className="landing"
      style={{
        "--city-image":
          `url(${cityImage})`,
      }}
    >

      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="landing-image" />

      <div className="landing-shade" />

      <div className="landing-grid" />

      <div className="scan-line" />


      {/* =====================================
          CITY LOCATION
      ====================================== */}

      <motion.div
        className="city-location"
        initial={{
          opacity: 0,
          x: 20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <MapPin size={17} />

        <span>
          Hyderabad
        </span>
      </motion.div>


      {/* =====================================
          CITY INFRASTRUCTURE SIGNALS
      ====================================== */}

      <Signal
        className="signal-rain"
        icon={CloudRain}
        text="Rainfall Monitoring"
        delay={0.7}
      />

      <Signal
        className="signal-drainage"
        icon={Droplets}
        text="Drainage System"
        delay={0.85}
      />

      <Signal
        className="signal-power"
        icon={Zap}
        text="Power Network"
        delay={1}
      />

      <Signal
        className="signal-hospital"
        icon={Hospital}
        text="Critical Services"
        delay={1.15}
      />

      <Signal
        className="signal-transport"
        icon={Bus}
        text="Public Transport"
        delay={1.3}
      />

      <Signal
        className="signal-citizen"
        icon={Radio}
        text="Citizen Signals"
        delay={1.45}
      />


      {/* =====================================
          MAIN LANDING CONTENT
      ====================================== */}

      <section className="landing-content">

        <motion.div
          className="landing-hero"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
        >

          <p className="landing-eyebrow">
            URBAN RESILIENCE INTELLIGENCE
          </p>


          <motion.h1
            initial={{
              opacity: 0,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
            }}
          >
            NERVA
          </motion.h1>


          <p className="full-name">
            Neural Engine for Resilient
            Virtual Assets
          </p>


          <div className="neural-divider">
            <span />

            <i />

            <span />
          </div>


          <motion.h2
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
          >
            Predict. Prevent. Coordinate.
          </motion.h2>


          <p className="landing-description">
            A digital nervous system for
            safer, smarter and more resilient
            cities.
          </p>


          {/* LIVE STATUS */}

          <motion.div
            className="online-status"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.6,
            }}
          >
            <motion.span
              animate={{
                opacity: [
                  0.45,
                  1,
                  0.45,
                ],

                scale: [
                  0.9,
                  1.15,
                  0.9,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

            CITY INTELLIGENCE ONLINE
          </motion.div>

        </motion.div>


        {/* =====================================
            ACCESS CARDS
        ====================================== */}

        <div className="access-cards">

          {accessCards.map(
            (card, index) => {

              const Icon =
                card.icon;

              return (
                <motion.button
                  key={card.title}

                  type="button"

                  className={
                    `access-card ${card.className}`
                  }

                  onClick={
                    card.action
                  }

                  initial={{
                    opacity: 0,
                    y: 35,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    duration: 0.55,
                    delay:
                      0.45 +
                      index * 0.12,
                  }}

                  whileHover={{
                    y: -7,
                    scale: 1.015,
                  }}

                  whileTap={{
                    scale: 0.98,
                  }}
                >

                  <div className="access-card-icon">
                    <Icon size={28} />
                  </div>


                  <div className="access-copy">

                    <strong>
                      {card.title}
                    </strong>

                    <span>
                      {card.description}
                    </span>

                  </div>


                  <motion.div
                    className="access-arrow"
                    whileHover={{
                      x: 4,
                    }}
                  >
                    <ArrowRight
                      size={20}
                    />
                  </motion.div>

                </motion.button>
              );
            }
          )}

        </div>


        {/* =====================================
            PLATFORM CAPABILITIES
        ====================================== */}

        <motion.div
          className="landing-bottom"

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 1,
          }}
        >

          <span>
            REAL DATA
          </span>

          <b>•</b>

          <span>
            DEPENDENCY INTELLIGENCE
          </span>

          <b>•</b>

          <span>
            CITIZEN SIGNALS
          </span>

          <b>•</b>

          <span>
            COORDINATED RESPONSE
          </span>

        </motion.div>

      </section>

    </main>
  );
}


/*
  =========================================================
  INFRASTRUCTURE SIGNAL COMPONENT
  =========================================================
*/

function Signal({
  className,
  icon: Icon,
  text,
  delay = 0.8,
}) {

  return (
    <motion.div
      className={
        `city-signal ${className}`
      }

      initial={{
        opacity: 0,
        scale: 0.8,
      }}

      animate={{
        opacity: 1,
        scale: 1,

        y: [
          0,
          -5,
          0,
        ],
      }}

      transition={{
        opacity: {
          duration: 0.8,
          delay,
        },

        scale: {
          duration: 0.8,
          delay,
        },

        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
    >

      <motion.div
        animate={{
          opacity: [
            0.65,
            1,
            0.65,
          ],
        }}

        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon size={17} />
      </motion.div>


      <span>
        {text}
      </span>

    </motion.div>
  );
}