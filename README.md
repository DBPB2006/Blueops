# BlueOps 🚀

> **Application Deployment Orchestration for Solo Developers and Small Teams**  
> *Deploy an application without being a DevOps expert.*

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![React Flow](https://img.shields.io/badge/React_Flow-@xyflow/react-FF0072)](https://reactflow.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Terraform](https://img.shields.io/badge/IaC-Terraform_AWS-844FBA?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Docker](https://img.shields.io/badge/Containers-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Zod](https://img.shields.io/badge/Schema-Zod-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)

---

## 📖 Executive Summary

Deploying modern cloud applications today requires mastering an overwhelming, fragmented landscape of technologies: writing multi-stage Dockerfiles, provisioning VPCs and subnets, designing security groups, writing complex Infrastructure-as-Code (Terraform/OpenTofu), configuring managed databases and automated backups, setting up reverse proxies with SSL/TLS certificates, constructing CI/CD pipelines, and tuning auto-scaling rules. For solo developers, startups, and small engineering teams, this DevOps burden distracts from building product value and introduces severe operational and security risks.

**BlueOps** eliminates this friction. It translates application code and high-level developer intent—expressed in plain English (e.g., uptime, downtime tolerance, expected users, budget)—into deterministic, validated cloud infrastructure. 

BlueOps strictly decouples the **Control Plane** (codebase analysis, AI-assisted architecture, interactive visual canvas, and pre-flight validation) from an **Execution Plane** (the user-controlled **BlueOps Runner**). By design, **cloud credentials never leave your local environment**, BlueOps never hosts your application, and untrusted user code is never executed on BlueOps servers.

---

## ⚖️ Core Philosophy: What BlueOps Is and Is NOT

| What BlueOps IS | What BlueOps Is NOT |
| :--- | :--- |
| **A Deployment Orchestrator**: Translates code + plain requirements into validated infrastructure. | **NOT a Hosting Platform (PaaS)**: We do not run your containers or databases on our own servers. |
| **A Separation of Planes**: Control plane designs and validates; local Runner executes. | **NOT a Black-Box AI Code Generator**: AI never writes raw Terraform or executes infrastructure commands directly. |
| **Technology-Agnostic Single Source of Truth**: Architecture is modeled in an abstract **Blueprint**, independent of cloud providers. | **NOT Just a Terraform GUI**: The internal model is cloud-independent; Terraform is simply one generator target. |
| **Zero-Credential Architecture**: Cloud access keys and IAM credentials stay strictly on your local machine. | **NOT an Arbitrary Remote Shell**: The Runner executes only deterministic, allowlisted commands. |

---

## 🛡️ The 6 Ironclad Team Rules

All modules, architectures, and pull requests in BlueOps strictly adhere to these 6 core principles:

1. **The Blueprint is the single source of truth**; the visual canvas is only a view.
2. **The canvas shows logical placement and relationships only**—never raw Docker, Kubernetes, VPC, subnet, or AWS service terms.
3. **AI only proposes**; deterministic validators and the capability catalog decide what is allowed.
4. **Blueprint versions are immutable**; they are never overwritten. Every edit creates a new version (`Draft` ➔ `Validated` ➔ `Generated` ➔ `Deployed`).
5. **The Runner runs only allowlisted commands**; cloud credentials never leave the user's machine.
6. **Never run the user's uploaded code**; static analysis only reads repository files.

---

## 🏛️ Architectural Planes & Security Boundary

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               BLUEOPS CONTROL PLANE                                    │
│                                                                                        │
│   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────────────────┐   │
│   │  Static Codebase │     │   Deterministic  │     │       AI Recommendation      │   │
│   │     Scanner      │ ──> │Capability Catalog│ <── │ (Strategies & Requirements)  │   │
│   │ (Pure Node.js)   │     │ (Allowed Rules)  │     │                              │   │
│   └──────────────────┘     └──────────────────┘     └──────────────────────────────┘   │
│                                      │                                                 │
│                                      ▼                                                 │
│                        ┌───────────────────────────┐                                   │
│                        │    Deployment Blueprint   │ <──── Single Source of Truth      │
│                        │  (@blueops/schema / Zod)  │                                   │
│                        └───────────────────────────┘                                   │
│                                  │       │                                             │
│                 ┌────────────────┘       └────────────────┐                            │
│                 ▼                                         ▼                            │
│   ┌───────────────────────────┐             ┌───────────────────────────┐              │
│   │     Blueprint Studio      │             │  Pre-Flight Validator     │              │
│   │  (React Flow Canvas View) │ <─────────> │    (@blueops/validator)   │              │
│   │   - Public / Private      │  Validated  │  - Structural  - Security │              │
│   │   - Plain Connections     │  Debounced  │  - Graph/Cycle - Config   │              │
│   └───────────────────────────┘             └───────────────────────────┘              │
│                 │                                         │                            │
│                 └─────────────────┬───────────────────────┘                            │
│                                   ▼                                                    │
│                        ┌───────────────────────────┐                                   │
│                        │ Server Approval Gate (API)│ (0 Errors Required)               │
│                        │  Locks Immutable Version  │                                   │
│                        └───────────────────────────┘                                   │
│                                   │                                                    │
│                                   ▼                                                    │
│                        ┌───────────────────────────┐                                   │
│                        │    Artifact Generators    │                                   │
│                        │  - Docker / Compose       │                                   │
│                        │  - Terraform (AWS)        │                                   │
│                        └───────────────────────────┘                                   │
│                                   │                                                    │
└───────────────────────────────────┼────────────────────────────────────────────────────┘
                                    │ Secure WebSocket / REST (Execution Job)
════════════════════════════════════╪═════════════════════════════════════════════════════
   SECURITY BOUNDARY                │ No Cloud Credentials Exchanged
════════════════════════════════════╪═════════════════════════════════════════════════════
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BLUEOPS EXECUTION PLANE (User Environment)                      │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                             BlueOps Runner CLI                                 │   │
│   │                                                                                │   │
│   │   • Runs on user's workstation or CI machine                                   │   │
│   │   • Holds user's local AWS credentials (IAM / ~/.aws)                          │   │
│   │   • Inspects and presents dry-run Deployment Plan for review                   │   │
│   │   • Executes ONLY allowlisted commands (e.g., terraform init/plan/apply)       │   │
│   │   • Streams live execution logs back to Control Plane via WebSockets           │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                                 │
│                                      ▼                                                 │
│                        ┌───────────────────────────┐                                   │
│                        │    User's AWS Account     │                                   │
│                        │  VPC, ALB, ECS, RDS, etc. │                                   │
│                        └───────────────────────────┘                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 The 11-Step End-to-End Lifecycle

1. **Upload Repository**: The developer provides a Git repository link or zip archive. The API unzips safely (protected against zip-slip) without running code.
2. **Static Analysis**: A pure Node.js scanner inspects package dependencies (`package.json`), build scripts, and `.env.example` to detect runtimes, frameworks, and database drivers.
3. **Deployment Strategies**: AI suggests 2–3 viable deployment options with clear trade-offs, strictly bounded by the hardcoded **Capability Catalog**.
4. **Requirements Gathering**: The user specifies operational needs in plain language (e.g., availability, budget, downtime tolerance), parsed into typed schema fields.
5. **Blueprint Proposed**: AI drafts a technology-independent Blueprint. The shared validator verifies it **before** the user ever sees it.
6. **Blueprint Studio (Visual Canvas)**: The user views and edits components, Public/Private zones, replicas, and connections in React Flow. Every edit runs client-side validation with real-time issue badges and automated **Fix** actions.
7. **Approval Gate**: Approval is disabled if any validation errors exist. Upon approval, the server re-validates independently and commits a new, immutable locked version (`Draft` ➔ `Validated`).
8. **Artifact Generation**: Deterministic template engines generate Dockerfiles, `docker-compose.yml`, and AWS Terraform manifests. Each file is tagged as `execute` (for the Runner) or `deliver` (for the user).
9. **Deployment Plan Review**: A structured dry-run plan (e.g., parsed `terraform plan`) is presented for explicit user review.
10. **Runner Execution**: The local Runner receives the allowlisted Execution Job, uses local AWS credentials, provisions cloud resources, and streams real-time status and logs.
11. **History & Audit**: Detailed execution logs, deployment status, and the exact deployed Blueprint version are recorded immutably in PostgreSQL.

---

## 📐 The Deployment Blueprint Contract

The **Deployment Blueprint** is the central contract of BlueOps, declared using [Zod](https://zod.dev/) in [`packages/schema`](file:///Users/dbprembhuvan/Desktop/blueops/packages/schema).

### Communication vs. Deployment Dependencies
BlueOps strictly decouples **communication topology** from **deployment dependencies**:
- **Connections (`connections`)**: Directed logical communication channels with descriptive semantic purposes (`sends_requests`, `reads_writes`, `publishes_to`, `consumes_from`). Used for network security and firewall configuration.
- **Explicit Dependencies (`dependsOn`)**: An explicit array of component IDs declaring operational startup order (e.g., an API component depends on a Database component). [`packages/graph`](file:///Users/dbprembhuvan/Desktop/blueops/packages/graph) constructs a separate dependency DAG to compute deterministic deployment order and detect deadlocks/cycles.

### Blueprint Example
```json
{
  "version": 1,
  "projectId": "proj-react-node-pg",
  "strategy": "containers_behind_lb",
  "requirements": {
    "availability": "survive_server_failure",
    "expectedUsers": 5000,
    "budget": "low",
    "downtimeTolerance": "minutes"
  },
  "components": [
    {
      "id": "web",
      "kind": "frontend",
      "label": "React Frontend",
      "zone": "public",
      "replicas": { "min": 2, "max": 4 },
      "dependsOn": ["api"]
    },
    {
      "id": "api",
      "kind": "api_service",
      "label": "Node.js REST API",
      "zone": "private",
      "replicas": { "min": 2, "max": 4 },
      "build": {
        "runtime": "node20",
        "buildCmd": "npm ci",
        "startCmd": "node server.js",
        "port": 5000,
        "healthPath": "/health"
      },
      "reason": "Two copies configured to survive single server failure",
      "dependsOn": ["db"]
    },
    {
      "id": "db",
      "kind": "postgres",
      "label": "Primary Database",
      "zone": "private",
      "backup": { "enabled": true, "days": 7 },
      "dependsOn": []
    }
  ],
  "connections": [
    { "id": "conn-web-api", "from": "web", "to": "api", "purpose": "sends_requests" },
    { "id": "conn-api-db", "from": "api", "to": "db", "purpose": "reads_writes" }
  ],
  "targets": ["docker", "terraform-aws"]
}
```

---

## 📂 Monorepo Structure

BlueOps is organized as an `npm workspaces` monorepo:

```
blueops/
├── apps/
│   ├── web/               # Frontend: React 19, React Flow, Tailwind CSS, Vite
│   ├── api/               # Backend: Node.js Express API, PostgreSQL via Prisma, Auth, History
│   └── runner/            # Execution Plane: Standalone Node.js CLI running locally
│
├── packages/
│   ├── schema/            # Canonical Zod contracts: Blueprint, Requirements, Jobs, Fixtures
│   ├── graph/             # Directed graph engine: Cycle detection, topological sort, dependsOn
│   ├── validator/         # Shared browser/server pre-flight validation rules & issue format
│   └── generators/        # Deterministic IaC code generators: Docker & Terraform for AWS
│
├── docs/                  # Architectural documentation, specs, and handbook notes
├── BlueOps_Team_Guide.docx # Authoritative 6-week execution guide & team agreements
├── BlueOps_Project_Handbook.pdf # Comprehensive background theory & system architecture
└── package.json           # Monorepo workspace root configuration
```

---

## 👥 Team Roles & Responsibilities

The project is executed over a 6-week timeline (October 26 – December 6, 2026):

| Team Member | Role | Core Ownership & Deliverables |
| :--- | :--- | :--- |
| **Prem Bhuvan** | **Team Lead** | Blueprint Core (`packages/schema`, `packages/graph`, `packages/validator`), Capability Catalog, Generator Interface, Runner Protocol & Security Design, Handbook Updates, System Integration. |
| **Pradeep** | **Platform Backend** | Platform API (`apps/api`), PostgreSQL + Prisma schema/migration, Version Lifecycle & Server Approval Gate, Docker Generator (`packages/generators/docker`), History APIs. |
| **Sruthi** | **Cloud & IaC** | AWS Terraform Generator (`packages/generators/terraform-aws`), Generator Compatibility Rules (`supports()`), AWS Test Environment & Billing Alarm, Execution Job Allowlist co-design. |
| **Manoj** | **Frontend** | Web Application (`apps/web`), Blueprint Studio Canvas, Shared UI Components, Logical Canvas Mappers, Real-Time Issues Bar & Fix Actions, Plan Review & History screens. |
| **Deeraj** | **Analyzer & AI** | Static Codebase Scanner (`apps/api/src/modules/analysis`), AI Strategy Recommendation & Requirements Interpretation (`modules/ai`), Upload & Analysis Wizards. |
| **Balaaditya** | **Runner & Execution** | BlueOps Runner CLI (`apps/runner`), Execution Job Engine, WebSocket Log Protocol, Terraform Plan Data Parsing, Scanner pairing. |

---

## 🛠️ Technology Stack & Decisions

Per the authoritative **BlueOps Team Guide**, the active technology stack is:

- **Monorepo**: npm workspaces
- **Frontend**: React 19 + Vite + React Flow (`@xyflow/react`) + Tailwind CSS
- **Backend API**: Node.js + Express
- **Database**: PostgreSQL with Prisma ORM (local containerized Postgres via Docker Compose; Blueprint revisions stored as JSONB with `UNIQUE(project_id, version_number)`)
- **Authentication**: JWT tokens (Bearer auth)
- **Validation**: Zod (shared across browser and server)
- **Graph Algorithms**: Pure JavaScript directed graph engine (Kahn's topological sort, Tarjan/DFS cycle detection)
- **Infrastructure Generation**: Template-based deterministic generation targeting Terraform on AWS (VPC, ECS/Fargate, RDS PostgreSQL, ALB)
- **Containerization**: Docker & Docker Compose generator
- **Execution**: Node.js CLI runner with strict command allowlisting

*(Note: Where the Team Guide conflicts with the earlier Project Handbook regarding languages or frameworks, the Team Guide is the authoritative source).*

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Docker & Docker Compose**: For local PostgreSQL database and container testing
- **AWS CLI** *(Optional, for deployment testing)*: Configured with local test credentials

### 2. Installation
Clone the repository and install all workspace dependencies from the root:

```bash
git clone https://github.com/DBPB2006/Blueops.git
cd Blueops
npm install
```

### 3. Environment Setup
Configure the API environment:

```bash
cd apps/api
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=6700
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blueops?schema=public"
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
```

### 4. Running the Database (PostgreSQL)
Start the local PostgreSQL container using Docker Compose:

```bash
docker compose up -d postgres
npx prisma migrate dev --name init
```

### 5. Running the Application
From the repository root, you can run individual services or workspaces:

```bash
# Start the Backend API (port 6700)
npm run dev:api

# Start the Frontend Web Studio (port 5173)
npm run dev:web

# Or run the Runner CLI
node apps/runner/bin/blueops-runner.js --help
```

---

## 🧪 Testing & Verification

BlueOps enforces high test coverage and strict regression prevention across its core libraries.

```bash
# Run all workspace test suites
npm test

# Run Schema contract tests (18 tests passing)
npm test --workspace=@blueops/schema

# Run Graph algorithms & dependency sorting tests (47 tests passing)
npm test --workspace=@blueops/graph

# Run Validator rules tests
npm test --workspace=@blueops/validator
```

---

## 🤝 Contribution & Git Workflow

All contributors follow the team working agreement outlined in **Team Guide Section A9**:

1. **Branch Naming**: All branches must follow the convention `feature/<name>-<task>` (e.g., `feature/prem-blueprint-core`, `feature/pradeep-prisma-migration`).
2. **Pull Requests**: Direct pushes to `main` are strictly prohibited. Every merge requires an approved Pull Request with at least one reviewer.
3. **No Secrets**: Never commit `.env` files or credentials. All environment files are `.gitignore`d.
4. **Clean Commits**: Write clear, imperative commit messages (`feat: add deployment dependency graph`, `fix: handle dangling connection references`).
5. **Contract Changes**: Any changes to shared schemas (`@blueops/schema`), execution job formats, or generator interfaces must be reviewed and approved by the Team Lead (**Prem Bhuvan**).

---

## 📚 Key Glossary

- **Blueprint**: The technology-independent, schema-validated JSON description of the system architecture. The single source of truth.
- **Canvas / Blueprint Studio**: The interactive visual workspace where developers view and manipulate architecture components and zones.
- **Layout**: Canvas presentation data (x/y coordinates, zoom level), kept strictly separate from the Blueprint.
- **Mapper**: Pure function that converts canvas edits into an updated draft Blueprint.
- **Validator**: Shared browser/server engine returning standardized issues (`{ severity, code, message, target, fix }`).
- **Capability Catalog**: Deterministic rule table specifying allowed architectural strategies and constraints.
- **Runner**: Standalone client CLI that executes deployment jobs locally using the user's cloud credentials.
- **Execution Job**: The exact, allowlisted list of commands that the Runner is permitted to execute.
- **Zone**: Logical security boundary—`public` (internet-facing) or `private` (internal/isolated).
- **dependsOn**: Explicit array of component IDs declaring operational startup dependencies, decoupled from communication links.

---

## 📄 License

This project is licensed under the ISC License. Copyright (c) 2026 DB Prem Bhuvan & The BlueOps Team.
