# BlueOps 🚀

> **Application Deployment Orchestration for Solo Developers and Small Teams**  
> *Deploy cloud applications with confidence without being a DevOps expert.*

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

## 📖 What is BlueOps?

Deploying modern web applications to the cloud is notoriously complex. Developers are forced to navigate an overwhelming array of fragmented technologies: writing multi-stage Dockerfiles, designing VPC network topologies, configuring security groups and reverse proxies, provisioning managed databases, configuring backups, wiring CI/CD pipelines, and writing complex Infrastructure-as-Code (Terraform).

For solo developers, startups, and agile teams, this DevOps burden creates significant overhead and security risk.

**BlueOps** solves this by translating application code and high-level requirements—expressed in plain terms (such as downtime tolerance, availability, expected users, and budget)—into deterministic, production-grade cloud infrastructure.

BlueOps introduces an architectural separation between a central **Control Plane** (analysis, blueprint modeling, and pre-flight validation) and a local **Execution Plane** (the user-side **BlueOps Runner**). Under this model:
- **Cloud credentials never leave your local environment.**
- **BlueOps never hosts your application or data.**
- **Untrusted user application code is never executed on BlueOps servers.**

---

## ⚖️ What BlueOps Is and Is NOT

| What BlueOps IS | What BlueOps Is NOT |
| :--- | :--- |
| **A Deployment Orchestrator**: Translates code + requirements into validated, production-ready infrastructure. | **NOT a Hosting Platform (PaaS)**: Does not run your containers or databases on third-party shared servers. |
| **A Separation of Planes**: Control plane designs and validates; local Runner executes. | **NOT a Black-Box AI Code Generator**: AI never directly writes raw Terraform or executes cloud commands without guardrails. |
| **Cloud-Agnostic Single Source of Truth**: Architecture is modeled in a clean **Blueprint**, decoupled from cloud providers. | **NOT Just a Terraform GUI**: The internal architecture model is technology-independent; Terraform is an output target. |
| **Zero-Credential Architecture**: Cloud keys and IAM credentials stay strictly on your local machine. | **NOT an Arbitrary Remote Shell**: The Runner executes only deterministic, allowlisted deployment commands. |

---

## 🏛️ Core Architectural Principles

1. **The Blueprint is the Single Source of Truth**: The visual canvas is strictly a projection. Infrastructure generators build from the validated Blueprint, never from raw canvas coordinates.
2. **Logical Abstractions on the Canvas**: The studio represents systems in human terms—Public/Private zones, service responsibilities, and connection purposes—not provider-specific jargon.
3. **AI Only Proposes; Deterministic Rules Enforce**: LLMs can recommend strategies, but rigid schema contracts, graph cycle checkers, and capability catalogs decide what is valid.
4. **Immutable Blueprint Versions**: Blueprints follow an immutable lifecycle (`Draft` ➔ `Validated` ➔ `Generated` ➔ `Deployed`). Every change produces a distinct revision.
5. **Zero Credential Exposure**: The Runner executes allowlisted commands locally with local cloud credentials.
6. **Safe Static Analysis**: Repositories are scanned statically without executing untrusted code.

---

## 🏗️ System Architecture & Planes

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

## 🔄 How It Works: The 11-Step Lifecycle

1. **Upload Repository**: Developer provides a Git repository link or zip archive. Safely extracted and unpacked.
2. **Static Analysis**: A pure Node.js scanner inspects package dependencies (`package.json`), build scripts, and configurations to detect runtimes, frameworks, and databases without executing code.
3. **Deployment Strategies**: Recommended deployment topologies with clear trade-offs are presented, constrained by a deterministic capability catalog.
4. **Requirements Gathering**: The user specifies operational needs in plain terms (availability, budget, downtime tolerance).
5. **Blueprint Proposed**: A candidate Deployment Blueprint is generated and automatically pre-flight validated before display.
6. **Blueprint Studio (Visual Canvas)**: The architecture is visualized in an interactive React Flow canvas. Developers can adjust components, replicas, and network zones with real-time validation badges and automated inline fixes.
7. **Approval Gate**: Approval requires zero validation errors. Upon approval, the server re-validates and locks a new, immutable Blueprint version.
8. **Artifact Generation**: Deterministic template engines generate Dockerfiles, `docker-compose.yml`, and AWS Terraform manifests.
9. **Deployment Plan Review**: A structured dry-run plan (such as `terraform plan` output) is generated for user inspection.
10. **Runner Execution**: The local BlueOps Runner executes the allowlisted plan using the developer's local AWS credentials, streaming live status and logs.
11. **History & Monitoring**: Deployment status, execution logs, and exact version history are preserved in PostgreSQL for auditing and rollbacks.

---

## 📐 The Deployment Blueprint Contract

The **Deployment Blueprint** is the central schema contract declared in [`packages/schema`](file:///Users/dbprembhuvan/Desktop/blueops/packages/schema):

- **Logical Connections (`connections`)**: Directed communication pathways defining network relationships and security boundaries (`sends_requests`, `reads_writes`, `publishes_to`, `consumes_from`).
- **Explicit Dependencies (`dependsOn`)**: An explicit list of prerequisite component IDs used to determine operational startup and deployment order via a dedicated DAG in [`packages/graph`](file:///Users/dbprembhuvan/Desktop/blueops/packages/graph).

### Example Blueprint
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

## 📂 Repository Structure

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
├── docs/                  # Architecture notes and specifications
└── package.json           # Monorepo workspace configuration
```

---

## 🛠️ Technology Stack

- **Monorepo**: npm workspaces
- **Frontend**: React 19, Vite, React Flow (`@xyflow/react`), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM (Docker Compose for local containerized Postgres)
- **Validation**: Zod (shared across browser and server)
- **Graph Algorithms**: Pure JavaScript directed graph engine (Kahn's topological sort, Tarjan/DFS cycle detection)
- **Infrastructure Targets**: Terraform on AWS (VPC, ECS/Fargate, RDS PostgreSQL, ALB)
- **Containerization**: Docker & Docker Compose
- **Execution Runner**: Node.js CLI with allowlisted command execution

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Docker & Docker Compose**: For local PostgreSQL and container workflows
- **AWS CLI** *(Optional)*: Configured with credentials if testing deployments

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

### 4. Database Setup (PostgreSQL)
Start the local PostgreSQL container using Docker Compose:

```bash
docker compose up -d postgres
npx prisma migrate dev --name init
```

### 5. Running the Application
From the repository root:

```bash
# Start the Backend API (port 6700)
npm run dev:api

# Start the Frontend Web Studio (port 5173)
npm run dev:web

# Run the Runner CLI
node apps/runner/bin/blueops-runner.js --help
```

---

## 🧪 Testing & Verification

BlueOps includes test suites across its core packages:

```bash
# Run all workspace test suites
npm test

# Run Schema contract tests
npm test --workspace=@blueops/schema

# Run Graph algorithms & dependency sorting tests
npm test --workspace=@blueops/graph

# Run Validator rules tests
npm test --workspace=@blueops/validator
```

---

## 📚 Core Concepts & Glossary

- **Blueprint**: The technology-independent, schema-validated JSON description of the application architecture. The single source of truth.
- **Blueprint Studio**: The interactive visual canvas where developers model and review application architecture.
- **Layout**: Visual coordinate data (x, y positions, zoom), maintained separately from the logical Blueprint.
- **Validator**: Shared engine returning structured issues (`{ severity, code, message, target, fix }`) across structural, security, configuration, and dependency rules.
- **Runner**: Standalone client CLI executing deployment jobs locally with the user's cloud credentials.
- **Execution Job**: The exact, allowlisted list of commands that the Runner is permitted to execute.
- **Zone**: Logical security placement—`public` (internet-facing) or `private` (internal/isolated).
- **dependsOn**: Explicit array of prerequisite component IDs declaring startup and provisioning order.
