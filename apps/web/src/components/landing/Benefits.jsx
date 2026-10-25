import Reveal from '../ui/Reveal';

export default function Benefits() {
  const cards = [
    {
      title: "Analyze Application",
      description: "Instantly map out service dependencies and environment needs directly from your source code."
    },
    {
      title: "Build Your Deployment Blueprint",
      description: "Visualize your entire stack in a single, editable map that defines how your software runs anywhere."
    },
    {
      title: "Generate Deployment Files",
      description: "Automatic creation of production-ready Kubernetes manifests, Dockerfiles, and Terraform scripts."
    },
    {
      title: "Deploy Through the BlueOps Runner",
      description: "Execute deployments with precision using a secure runner that handles the heavy lifting of orchestration."
    }
  ];

  return (
    <section className="py-16 md:py-20 px-6 lg:px-12 bg-enerblock-light border-b border-enerblock-dark/10">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tighter mb-16 max-w-4xl headline">
            Don't Write YAML.<br />Just Build.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="bg-enerblock-red text-white p-8 aspect-square flex flex-col justify-between group hover:bg-enerblock-dark transition-colors duration-300">
              <div className="flex justify-between text-xs uppercase tracking-widest font-bold mono opacity-80">
                <span>Outcome 0{i + 1}</span>
                <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-300">+</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight leading-none">{card.title}</h3>
                <p className="text-sm opacity-90 font-medium leading-relaxed">{card.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
        </div>
      </div>
    </section>
  );
}
