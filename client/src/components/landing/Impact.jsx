import Reveal from '../ui/Reveal';

export default function Impact() {
  return (
    <section className="py-16 md:py-20 px-6 lg:px-12 bg-enerblock-light border-b border-enerblock-dark/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-none tracking-tighter mb-6 headline">
              Understand<br />Your Application.
            </h2>
            <div className="mt-16 border-t border-enerblock-dark/10 pt-8">
              <img alt="Deployment Blueprint Graph" className="w-full object-cover rounded-none hover:scale-[1.02] transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLuLv_RMlPqmS3w2whPfXsw7BSI24Va_hgXyaNkIfmp6ePJAWoePX16kECHWxothCm5dzfh6Bdkybip-K51NBdbVB3vlucC7cniyOxGFH6enRIoOU3w-URWCcr4z9gUK1Rjjwta_fM_TJVlo-5SUZenTIpF8i6YtIPWCMLHnYRwr87DNGP6SbVvL_6xvKaIu_qzihJSClhiZujC3PHFkMlZU2kKhU3tCsz7b0wH3HV_y8BH0gZTJPQHmJlv5"/>
              <div className="flex justify-between text-xs uppercase tracking-widest mt-4 text-enerblock-dark/60 mono">
                <span>Fig. 02</span>
                <span>Deployment Blueprint</span>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:pl-12 flex flex-col justify-center">
          <Reveal delay={0.1}>
            <p className="text-2xl font-medium leading-relaxed mb-12 max-w-2xl text-enerblock-dark">By analyzing your source code directly, we eliminate the manual work of writing configuration files and scripts.</p>
            <p className="text-lg leading-relaxed text-enerblock-dark/80 max-w-xl">Our engine scans your repository to understand its structure, dependencies, and requirements. BlueOps then automatically generates a visual blueprint and all the Docker, Kubernetes, and Terraform files needed for production.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
