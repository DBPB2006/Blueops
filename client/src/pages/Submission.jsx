import { useState } from "react";
import { Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import Reveal from '../components/ui/Reveal';

export default function Submission() {
  const [selectedMethod, setSelectedMethod] = useState(0);

  const submissionMethods = [
    {
      id: "METHOD 01",
      title: "Connect GitHub",
      description: "Connect your GitHub organization or personal account. BlueOps automatically scans branches, PRs, and dependency trees.",
      action: "Select Provider",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    },
    {
      id: "METHOD 02",
      title: "Upload Compressed Archive",
      description: "Directly upload a zipped project directory (.zip / .tar.gz). All local environment configurations are analyzed securely.",
      action: "Browse Files",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      id: "METHOD 03",
      title: "Remote Git Repository URL",
      description: "Provide an accessible HTTPS or SSH repository endpoint from GitLab, Bitbucket, Azure DevOps, or self-hosted Git instances.",
      action: "Enter Endpoint",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    }
  ];

  const technologies = [
    { num: "01 /", category: "Frontend Frameworks", items: ["React", "Next.js", "Vue", "Nuxt", "Angular", "Svelte"] },
    { num: "02 /", category: "Backend Runtimes", items: ["Node.js", "Express", "NestJS", "Python FastAPI", "Django", "Go", "Rust", "Spring Boot"] },
    { num: "03 /", category: "Data & Caching", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "TimescaleDB"] },
    { num: "04 /", category: "Cloud Invariants", items: ["Docker Containers", "Kubernetes Manifests", "Terraform HCL", "Helm Charts", "GitHub Actions"] }
  ];

  const timelineSteps = [
    { phase: "01", label: "Source Repository Received" },
    { phase: "02", label: "Semantic AST Inspection" },
    { phase: "03", label: "Architecture Discovery" },
    { phase: "04", label: "Blueprint Graph Synthesis" },
    { phase: "05", label: "Runner Execution Ready" }
  ];

  return (
    <div className="bg-enerblock-light text-enerblock-dark min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navigation />

      {/* Hero Chapter: Light Industrial treatment */}
      <header className="relative bg-enerblock-light pt-24 pb-14 px-6 lg:px-12 border-b border-enerblock-dark/20 flex flex-col justify-between min-h-[42vh]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <span className="text-xs uppercase tracking-widest font-bold mb-3 text-enerblock-red mono block">
                Chapter 02 // Application Submission
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-none tracking-tighter text-enerblock-dark mb-4">
                Let's Understand<br />Your Architecture.
              </h1>
              <p className="text-lg font-medium leading-relaxed text-enerblock-dark max-w-xl">
                Upload your source repository or connect your provider. BlueOps decodes your project's DNA to generate an exact deployment blueprint without manual configuration.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 border-l border-enerblock-dark/20 pl-6 lg:pl-10 pb-2">
            <Reveal delay={0.1}>
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-widest font-bold text-enerblock-dark mono block">
                  Security Guarantee
                </span>
                <p className="text-xs font-medium text-enerblock-dark/80 leading-relaxed max-w-sm">
                  Repository inspection runs inside ephemeral, read-only sandboxes. Source code is analyzed strictly for topology synthesis and never stored.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full mt-10 pt-6 border-t border-enerblock-dark/20 flex justify-between items-center text-[10px] uppercase tracking-widest text-enerblock-dark/70 mono">
          <span>[1] CONNECTION // [2] analysis // [3] blueprint // [4] deployment</span>
          <span>Verified Sandbox Engine</span>
        </div>
      </header>

      {/* Submission Methods Section matching Home Page Card layout */}
      <section className="py-20 px-6 lg:px-12 bg-enerblock-light border-b border-enerblock-dark/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Reveal>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-enerblock-dark/50 mono mb-2">
                <span>01</span>
                <span className="w-4 h-px bg-enerblock-dark/30"></span>
                <span>Connection Method</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter mb-3">
                Select Connection Method
              </h2>
              <p className="text-base text-enerblock-dark/80 max-w-xl font-medium">
                Choose how you want BlueOps to ingest and inspect your code dependencies.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {submissionMethods.map((method, index) => {
              const isSelected = selectedMethod === index;
              return (
                <Reveal key={index} delay={index * 0.05}>
                  <button 
                    onClick={() => setSelectedMethod(index)}
                    className={`w-full text-left p-6 md:p-8 flex flex-col justify-between min-h-[300px] group transition-all duration-300 border rounded-none ${
                      isSelected 
                        ? 'bg-enerblock-red text-white border-enerblock-red shadow-lg' 
                        : 'bg-white text-enerblock-dark border-enerblock-dark/15 hover:border-enerblock-red'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6 pb-3 border-b border-current/10">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">
                          {method.id}
                        </span>
                        <span className={`w-2 h-2 rounded-none ${isSelected ? 'bg-white animate-pulse' : 'bg-enerblock-dark/20 group-hover:bg-enerblock-red'}`}></span>
                      </div>
                      
                      <div className={`mb-4 ${isSelected ? 'text-white' : 'text-enerblock-dark group-hover:text-enerblock-red'} transition-colors`}>
                        {method.icon}
                      </div>

                      <h3 className="text-2xl font-bold mb-3 tracking-tight">
                        {method.title}
                      </h3>
                      <p className={`text-xs leading-relaxed font-medium ${isSelected ? 'text-white/90' : 'text-enerblock-dark/70'}`}>
                        {method.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-current/10 mt-6 flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest">
                      <span>{method.action}</span>
                      <span>→</span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Technologies Grid matching Home Page Clean Typography */}
      <section className="py-20 px-6 lg:px-12 bg-white border-b border-enerblock-dark/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-enerblock-dark/50 mono mb-2">
                <span>02</span>
                <span className="w-4 h-px bg-enerblock-dark/30"></span>
                <span>Engine Compatibility</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter text-enerblock-dark mb-3">
                Automatic Technology Detection
              </h2>
              <p className="text-sm text-enerblock-dark/75 max-w-xl">
                Our engine automatically detects and configures these runtimes, frameworks, and cloud invariants during repository analysis.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((techGroup, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="p-6 border border-enerblock-dark/15 bg-white flex flex-col justify-between h-full hover:border-enerblock-dark transition-colors duration-300 rounded-none">
                  <div>
                    <span className="text-enerblock-red font-bold text-base mono block mb-3">
                      {techGroup.num}
                    </span>
                    <h4 className="text-lg font-bold mb-4 text-enerblock-dark">
                      {techGroup.category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {techGroup.items.map((item, j) => (
                        <span key={j} className="text-[10px] font-mono font-bold px-2 py-1 bg-white border border-enerblock-dark/15 text-enerblock-dark/80 rounded-none">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* System Section Dark Finish matching Home SystemSection treatment */}
      <section className="bg-enerblock-dark text-white py-20 md:py-24 px-6 lg:px-12 relative overflow-hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 items-center">
            <div>
              <Reveal>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white/50 mono mb-2">
                  <span>03</span>
                  <span className="w-4 h-px bg-white/30"></span>
                  <span>Orchestration Pipeline</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter text-white">
                  Ready for Autonomous Analysis.
                </h2>
              </Reveal>
            </div>
            <div>
              <Reveal delay={0.1}>
                <p className="text-base leading-relaxed text-white/75 font-medium max-w-md">
                  Everything is ready. Begin analysis to decode repository properties and synthesize your live deployment blueprint.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="divide-y divide-white/10 mb-10 max-w-4xl border-t border-b border-white/10">
            {timelineSteps.map((step, index) => (
              <Reveal key={index} delay={index * 0.05}>
                <div className="py-4 flex justify-between items-center group">
                  <div className="flex items-center gap-6">
                    <span className="text-enerblock-red font-bold text-base mono">{step.phase} /</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-enerblock-red transition-colors headline">
                      {step.label}
                    </h3>
                  </div>
                  <div className="w-8 h-8 border border-white/20 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity font-mono text-xs text-enerblock-red bg-white/5 rounded-none">
                    ✓
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 mt-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">Initialize Repository Scan</h3>
                <p className="text-xs text-white/60 font-medium">No files will be modified in your remote branch during initial discovery.</p>
              </div>

              <Link
                to="/intelligence"
                className="bg-white text-enerblock-dark px-10 py-5 rounded-none hover:bg-enerblock-red hover:text-white transition-all duration-300 text-xs uppercase tracking-widest font-bold inline-flex items-center group shadow-xl"
              >
                Analyze Repository
                <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
          </Reveal>

        </div>

        {/* Subtle architectural overlay graph matching SystemSection */}
        <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-10 pointer-events-none mix-blend-overlay">
          <img 
            alt="Abstract architecture graph" 
            className="w-full h-full object-cover grayscale" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLuG44Q6pPhptv5VWEjSztIL8A9OBsO-TOET_UJpb7a9pvdAhkQrlp2BBZbs1PqtvGI33UoWcy7mcCXqXl3Z9eCU-Z85LMfkmXpXDPUPMNlzOB6M34f6KQkkepTtbtu6TOe1JMNDjTLd61uXN8gjvxUYRYYiyboKRmASGf-CC7I_vpeJ3EWormprMoLPzHLgK-NnLIhjyO5bTLEuD1LKP1Q9jO1czchGglEQdKux_95WFYaIjIuWULtA6ue8"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
