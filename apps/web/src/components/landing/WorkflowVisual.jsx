import Reveal from '../ui/Reveal';

export default function WorkflowVisual() {
  const items = [
    {
      title: "Works on Every Cloud",
      desc: "AWS, GCP, Azure, and bare metal support via unified blueprints."
    },
    {
      title: "Secure, Private Runners",
      desc: "Lightweight runner runs inside your secure perimeter. Zero inbound rules."
    },
    {
      title: "No Manual Config Drift",
      desc: "Declarative state reconciles automatically. Unauthorized edits are reset."
    }
  ];

  return (
    <section className="py-16 px-6 lg:px-12 bg-enerblock-light border-y border-enerblock-dark/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">Built for any cloud,<br/>run by you.</h2>
              <p className="text-lg text-enerblock-dark/80 mb-8">Deploy to AWS, GCP, Azure, or on-prem without changing a single line of your blueprint. We handle the complexity of cloud providers for you.</p>
            </Reveal>
            <div className="space-y-4">
              {items.map((item, i) => (
                <Reveal key={i} delay={0.1 + (i * 0.05)}>
                  <div className="py-4 border-b border-enerblock-dark/10 flex justify-between items-center group cursor-pointer">
                    <h3 className="text-xl font-bold group-hover:text-enerblock-red transition-colors">{item.title}</h3>
                    <span className="text-xl">+</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <Reveal delay={0.2}>
              <img alt="Workflow visualization" className="w-full rounded-none grayscale shadow-2xl" src="https://lh3.googleusercontent.com/aida/AP1WRLtcsOEYxvyiY7XupT-a1UzxE_jxU8EsWoW41Rz45WsvIyOjEhSMpuh3N21LEtl1JXwbVXhiLUFGoJYAm95Eccmqdr6ShrAflPsbuPc81n537VqitAo99ZMmx4c-CgIZGYKnajTw07LWN_-BcX6ai2T36Tg_qYr9J8LAsPkog5nayX9CioxhSN1SH85ZiQtoaxWu8xg-jQXsIUFxgzD_fqBfQ9UZEEnSGW3nn-_HfxyrDES6TEvKgNRzPlIT"/>
              <p className="text-xs uppercase tracking-widest mt-4 text-enerblock-dark/60 mono text-right">Fig. 03 — Deployment Workflow Visualization</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
