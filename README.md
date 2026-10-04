# NERVA — Neural Engine for Resilient Virtual Assets

> **A predictive urban resilience platform for understanding cascading infrastructure impacts before they become city-wide disruptions.**

NERVA is a smart-city resilience prototype designed to connect traditionally isolated urban systems—such as drainage, mobility, power, emergency services, field response, and citizen reporting—into a unified operational intelligence platform.

Instead of viewing infrastructure incidents independently, NERVA models how disruption in one system may propagate into others and helps decision-makers understand **what is happening, what may happen next, and which departments may need to coordinate.**

---

## The Problem

Modern cities operate through highly interconnected infrastructure, but many departments still monitor and respond to incidents independently.

For example:

**Heavy Rainfall → Drainage Stress → Waterlogging Risk → Traffic Disruption → Emergency Service Delay**

A drainage problem is therefore not always just a drainage problem.

Without a cross-system view, authorities may identify individual incidents but have limited visibility into their possible cascading effects.

NERVA explores a different approach: **model the city as a connected system.**

---

## What NERVA Does

NERVA provides a prototype digital command environment that can:

- Monitor modelled urban infrastructure systems
- Visualize infrastructure through a city digital twin
- Model cascading dependencies between systems
- Simulate heavy-rainfall infrastructure scenarios
- Identify potential cross-department impacts
- Recommend prototype coordination actions
- Provide a dedicated workspace for field response teams
- Allow citizens to submit local incident reports
- Present operational intelligence through a unified command dashboard

---

## Core Scenario

The current prototype focuses on a **heavy-rainfall urban resilience scenario in Hyderabad**.

NERVA models the dependency chain:

```text
Heavy Rainfall
      ↓
Drainage Stress
      ↓
Waterlogging Risk
      ↓
Traffic Disruption
      ↓
Emergency Service Delay
```

This demonstrates how an initial environmental trigger can potentially propagate through multiple dependent city systems.

---

## NERVA Predictive Engine

The predictive simulation demonstrates how NERVA could analyze infrastructure dependencies and generate decision-support intelligence.

The prototype presents:

- Cascade depth
- Maximum predicted severity
- Departments potentially affected
- Infrastructure dependency chain
- Recommended coordination actions

Example prototype recommendations include:

- Inspect high-risk drainage zones
- Prepare traffic diversions
- Alert emergency response teams
- Monitor citizen reports

> The current predictive outputs are prototype simulations and are not real government forecasts.

---

## City Command

The **City Command Workspace** acts as the central operational dashboard.

It provides an overview of:

- City resilience
- Citizen signals
- Active alerts
- Field teams
- Connected infrastructure systems
- System health
- Priority signals
- Digital Twin access
- NERVA simulation
- Operations reports

The interface is designed as a prototype of a cross-department city intelligence environment.

---

## City Digital Twin

NERVA includes an interactive Hyderabad infrastructure map built using Leaflet.

The Digital Twin represents modelled infrastructure including:

- Drainage systems
- Mobility networks
- Power infrastructure
- Critical services
- Rainfall / flood monitoring zones

Users can search Hyderabad locations, inspect infrastructure nodes, switch map layers, and explore modelled system health.

---

## Field Response

NERVA includes a separate workspace for field response personnel.

Field teams can conceptually:

- Access assigned incidents
- Inspect response priorities
- View incident locations
- Start response workflows
- Verify field conditions
- Send operational updates back to City Command

The current identity and assignment workflows are simulated for prototype demonstration.

---

## Citizen Access

The Citizen Access module demonstrates how residents could contribute local ground-level information to the city intelligence system.

Citizens can submit reports containing information such as:

- Incident type
- Description
- Location
- Supporting image

Citizen reports could complement infrastructure sensors and official information by providing additional real-world signals.

---

## System Architecture

```text
                    ┌─────────────────────┐
                    │      Citizens       │
                    │   Incident Signals  │
                    └──────────┬──────────┘
                               │
                               ▼
┌────────────────┐    ┌──────────────────────┐
│ Infrastructure │───▶│        NERVA         │
│     Systems    │    │ Intelligence Engine  │
└────────────────┘    └──────────┬───────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
          ┌──────────────────┐      ┌──────────────────┐
          │   City Command   │      │   Field Teams    │
          │ Decision Support │      │ Response Network │
          └──────────────────┘      └──────────────────┘
```

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- Framer Motion
- Lucide React

### Mapping

- Leaflet
- React Leaflet
- OpenStreetMap

### Development

- Git
- GitHub
- npm

---

## Project Structure

```text
NERVA/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── CommandLogin.jsx
│   │   │   ├── CommandDashboard.jsx
│   │   │   ├── CityMap.jsx
│   │   │   ├── NervaSimulation.jsx
│   │   │   ├── OperationsReport.jsx
│   │   │   ├── FieldLogin.jsx
│   │   │   ├── FieldTeam.jsx
│   │   │   └── Citizen.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Running NERVA Locally

### 1. Clone the repository

```bash
git clone https://github.com/HarshiniRachakonda188141/NERVA.git
```

### 2. Enter the frontend directory

```bash
cd NERVA/frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local address displayed by Vite in your browser.

---

## Production Build

To create a production build:

```bash
npm run build
```

The generated production files will be available inside:

```text
frontend/dist/
```

---

## Current Prototype Modules

| Module | Purpose |
|---|---|
| Public Landing | Entry point to the NERVA platform |
| City Command Login | Prototype authorised command access |
| City Command Dashboard | Unified operational overview |
| City Digital Twin | Interactive infrastructure visualization |
| NERVA Simulation | Cascading-impact modelling |
| Operations Report | Operational intelligence summary |
| Field Login | Prototype response-team access |
| Field Response | Incident assignments and response workflow |
| Citizen Access | Citizen incident reporting |

---

## Prototype Disclaimer

NERVA is currently an **academic and hackathon prototype**.

The infrastructure conditions, resilience scores, alerts, identities, incident assignments, predictions, recommendations, and operational information displayed by the prototype are simulated unless explicitly connected to a verified external data source.

NERVA is **not currently connected to official government emergency, infrastructure, identity, or command systems** and should not be used for real-world emergency decisions.

A production implementation would require validated data sources, secure government integrations, authentication and authorization controls, privacy safeguards, model validation, cybersecurity controls, auditing, and appropriate institutional approval.

---

## Future Scope

Future development could extend NERVA with:

- Real-time weather feeds
- IoT infrastructure sensors
- Traffic intelligence
- GIS infrastructure datasets
- Historical incident datasets
- Machine-learning risk prediction
- Graph-based infrastructure dependency modelling
- Dynamic cascade probability estimation
- Automated inter-department alerts
- Live field-team coordination
- Citizen-report verification
- Explainable AI recommendations
- Multi-city Digital Twin support

---

## Vision

NERVA explores a simple idea:

> **Cities should not only detect infrastructure failures—they should understand how those failures may spread.**

By connecting infrastructure intelligence, predictive modelling, citizen signals, and response coordination, NERVA aims to demonstrate how cities could move from **reactive incident management toward predictive urban resilience.**

---

## Author

**Rachakonda Harshini**

B.Tech — Computer Science & Engineering  
Cyber Security

---

**NERVA — See the impact before it spreads.**
