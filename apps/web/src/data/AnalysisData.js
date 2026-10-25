export const analysisData = [
  {
    id: "summary",
    title: "Repository Summary",
    content: {
      type: "keyValue",
      data: [
        { label: "Primary Language", value: "TypeScript (84%)" },
        { label: "Framework", value: "Next.js 14.x" },
        { label: "Architecture", value: "Monolithic with distinct service boundaries" },
        { label: "State", value: "Stateless (Session managed via Redis)" }
      ]
    }
  },
  {
    id: "services",
    title: "Detected Services",
    content: {
      type: "list",
      data: [
        { name: "Frontend Web Server", description: "Next.js application handling SSR and API routes." },
        { name: "Authentication Provider", description: "NextAuth.js integration detected with OAuth providers." },
        { name: "Database Cluster", description: "PostgreSQL relational database schema discovered via Prisma." },
        { name: "Caching Layer", description: "Redis instance required for rate limiting and sessions." }
      ]
    }
  },
  {
    id: "dependencies",
    title: "Dependencies & Environment",
    content: {
      type: "keyValue",
      data: [
        { label: "Node.js Version", value: "v20.x (LTS recommended)" },
        { label: "Database ORM", value: "Prisma ^5.0.0" },
        { label: "Styling", value: "Tailwind CSS" },
        { label: "Required Env Vars", value: "DATABASE_URL, REDIS_URL, NEXTAUTH_SECRET" }
      ]
    }
  },
  {
    id: "recommendations",
    title: "Deployment Recommendations",
    content: {
      type: "text",
      data: "Based on the repository analysis, a containerized deployment using Docker is recommended. The Next.js frontend should be deployed as a stateless service with horizontal autoscaling. PostgreSQL and Redis should be provisioned as managed services or highly available stateful sets to ensure data persistence and optimal caching performance."
    }
  }
];
