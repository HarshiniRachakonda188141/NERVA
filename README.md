# NERVA

## Neural Engine for Resilient Virtual Assets

NERVA is an experimental urban resilience decision-support prototype.

Instead of viewing roads, drainage, power, water, traffic junctions and critical facilities as isolated systems, NERVA models selected infrastructure as a connected dependency network.

The prototype explores three questions:

1. What could happen next?
2. Why could it happen?
3. Who may need to act?

---

## Core Idea

Urban infrastructure is interconnected.

A failure in one system can potentially influence another.

Example prototype scenario:

Heavy Rainfall

↓

Central Drain D04

↓

Central Link Road R17

↓

Central Junction J03

↓

Hospital H02

NERVA uses a graph-based model to represent these dependencies and simulate possible cascading effects.

---

## Prototype Features

### City Pulse

Provides a simplified overview of infrastructure status.

### Digital Twin View

The interface contains three visualization modes:

- Surface
- X-Ray
- Neural

### Infrastructure Graph

Infrastructure assets are represented as nodes and their dependencies as edges.

### Cascade Simulation

A modelled event can propagate through connected infrastructure.

### Explainable Path

NERVA displays the dependency path responsible for a modelled cascade.

### Department Coordination

The system identifies departments associated with affected infrastructure.

### Prevent the Cascade

Users can test a modelled intervention and compare the potential impact before and after the intervention.

### Citizen Signal

The prototype includes an interface for reporting local infrastructure problems.

### Prototype Authentication

A basic login and signup flow is included for demonstration purposes.

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Framer Motion
- Lucide React
- Axios

### Backend

- Python
- FastAPI
- NetworkX
- Pydantic

### Data

Prototype JSON infrastructure datasets.

---

## Project Structure

```text
NERVA/
├── backend/
│   ├── engines/
│   ├── routes/
│   ├── main.py
│   ├── config.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── data/
│   ├── assets.json
│   ├── relationships.json
│   └── scenarios.json
│
├── docs/
│   └── ARCHITECTURE.md
│
├── netlify.toml
└── README.md