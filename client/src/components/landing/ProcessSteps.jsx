import Reveal from '../ui/Reveal';

export default function ProcessSteps() {
  const steps = [
    {
      num: "01",
      title: "Upload Repository",
      description: "Connect your GitHub, GitLab, or Bitbucket account to let BlueOps access your application source code."
    },
    {
      num: "02",
      title: "Analyze Application",
      description: "Our engine scans your code to identify frameworks, languages, and required infrastructure components."
    },
    {
      num: "03",
      title: "Design Deployment",
      description: "Review and refine the discovered service map to match your specific production requirements."
    },
    {
      num: "04",
      title: "Build Deployment Blueprint",
      description: "Convert your design into a single source of truth that defines networking, security, and compute needs."
    },
    {
      num: "05",
      title: "Generate DevOps Files",
      description: "BlueOps writes the boilerplate for you—generating all the YAML and scripts needed to provision and run your app."
    },
    {
      num: "06",
      title: "Deploy Through Runner",
      description: "Push to production instantly across any cloud or environment using the lightweight BlueOps Runner."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 lg:px-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
        {steps.map((step, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="flex items-start gap-8 group">
              <div className="text-6xl md:text-7xl font-bold text-enerblock-red/20 group-hover:text-enerblock-red transition-colors leading-none tracking-tighter italic headline">
                {step.num}
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-enerblock-dark/70">{step.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
