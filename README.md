# BlueOps 🚀

> **Application Deployment Orchestration for Solo Developers and Small Teams**

BlueOps translates high-level developer intent and application code into deterministic, validated cloud infrastructure. By separating the **Control Plane** (analysis, blueprinting, planning) from an **Execution Plane** (user-environment Runner), BlueOps ensures that cloud credentials never leave your local environment.

---

## 🏗️ Architecture Overview

- **Codebase Analysis**: Detects application runtimes, frameworks, and service boundaries.
- **AI-Assisted Architecture**: Interprets plain-language deployment requirements behind a strict, schema-validated model.
- **Deployment Blueprint**: Single source of truth defining application architecture independent of any single cloud provider.
- **Blueprint Studio**: Interactive React Flow visual canvas for modeling architecture topology and inspecting resource properties.
- **Validation Engine**: Pre-flight validation catching configuration, dependency, and security flaws before infrastructure provisioning.
- **Terraform Artifact Generator**: Generates clean, inspectable Infrastructure-as-Code targeting AWS.
- **Execution Runner**: Standalone process running in your environment executing plans with zero third-party credential exposure.

---

## 📁 Repository Structure

```
blueops/
├── client/     # React 19 + React Flow (@xyflow/react) + Tailwind CSS UI
└── server/     # Express API backend with MongoDB / Mongoose persistence
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (running locally on `mongodb://localhost:27017`)

### 2. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` to explore the Landing Page and Blueprint Studio.
