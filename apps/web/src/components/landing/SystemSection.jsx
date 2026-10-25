import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

export default function SystemSection() {
  const steps = [
    {
      num: "01 /",
      title: "Repository Analysis",
      desc: "AST source code parsing maps framework boundaries and environment requirements.",
      icon: (
        <svg className="w-5 h-5 text-enerblock-red" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
        </svg>
      )
    },
    {
      num: "02 /",
      title: "Blueprint Engine",
      desc: "Synthesizes code properties into a declarative deployment topology map.",
      icon: (
        <svg className="w-5 h-5 text-enerblock-red" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.11-.9-2-2-2zm-9 14H5v-2h6v2zm-2.58-4.58l-1.42 1.41L2.59 10.4 7 6l1.41 1.41L5.42 10.4l2.99 3.02z"></path>
        </svg>
      )
    },
    {
      num: "03 /",
      title: "Automated DevOps Files",
      desc: "Generates production-ready Kubernetes, Docker, and Terraform files automatically.",
      icon: (
        <svg className="w-5 h-5 text-enerblock-red" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9-3h2v5h-2V4zm9 16H4V9h5v3h6V9h5v11z"></path>
        </svg>
      )
    },
    {
      num: "04 /",
      title: "Secure Runner",
      desc: "Executes blueprints securely within your environment to guarantee zero drift.",
      icon: (
        <svg className="w-5 h-5 text-enerblock-red" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 15v4H5v-4h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 18.5c-.82 0-1.5-.67-1.5-1.5s.68-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 5v4H5V5h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 8.5c-.82 0-1.5-.67-1.5-1.5S6.18 5.5 7 5.5s1.5.68 1.5 1.5S7.83 8.5 7 8.5z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-enerblock-dark text-white py-20 md:py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 max-w-7xl mx-auto">
        <div>
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold leading-none tracking-tighter mb-8 text-enerblock-red">One Deployment Blueprint. Multiple DevOps Technologies.</h2>
          </Reveal>
        </div>
        <div>
          <Reveal delay={0.1}>
            <p className="text-xl leading-relaxed text-white/80 max-w-xl">The BlueOps System is a developer-first suite designed to offload the burden of infrastructure management. You focus on building great software; we handle the complex DevOps configurations required to run it.</p>
            <div className="mt-8">
              <Link to="/submission" className="bg-enerblock-red text-white px-8 py-4 rounded-none hover:bg-white hover:text-enerblock-dark transition-colors text-sm uppercase tracking-widest font-bold inline-block">Download Runner</Link>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="mt-32 max-w-4xl mx-auto divide-y divide-white/10 relative z-10">
        {steps.map((step, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="py-8 flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-8">
                <span className="text-enerblock-red font-bold text-2xl mono">{step.num}</span>
                <h3 className="text-3xl md:text-5xl font-bold text-white group-hover:text-enerblock-red transition-colors">{step.title}</h3>
              </div>
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                {step.icon}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-20 pointer-events-none mix-blend-overlay">
        <img alt="Abstract architecture graph" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida/AP1WRLuG44Q6pPhptv5VWEjSztIL8A9OBsO-TOET_UJpb7a9pvdAhkQrlp2BBZbs1PqtvGI33UoWcy7mcCXqXl3Z9eCU-Z85LMfkmXpXDPUPMNlzOB6M34f6KQkkepTtbtu6TOe1JMNDjTLd61uXN8gjvxUYRYYiyboKRmASGf-CC7I_vpeJ3EWormprMoLPzHLgK-NnLIhjyO5bTLEuD1LKP1Q9jO1czchGglEQdKux_95WFYaIjIuWULtA6ue8"/>
      </div>
    </section>
  );
}
