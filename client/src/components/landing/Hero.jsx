import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

export default function Hero() {
  return (
    <header className="relative min-h-screen bg-enerblock-red flex flex-col justify-between pt-32 pb-12 px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full flex-grow">
        <div className="flex flex-col justify-between">
          <Reveal>
            <div>
              <h2 className="text-sm uppercase tracking-widest font-bold mb-4 text-white mono">Developer Intelligence</h2>
              <h1 className="text-5xl md:text-7xl font-bold leading-none tracking-tighter text-enerblock-dark mb-8 md:text-9xl">Design your<br/>deployment.<br/>BlueOps handles<br/>the DevOps.</h1>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8">
              <p className="text-sm uppercase tracking-widest font-bold text-white mono opacity-90 max-w-xl">No Dockerfiles. No Kubernetes YAML. No Terraform. No Jenkinsfiles. Describe your deployment once. BlueOps handles the rest.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/blueprint" className="bg-enerblock-dark text-white px-8 py-4 rounded-none hover:bg-white hover:text-enerblock-dark transition-colors text-sm uppercase tracking-widest font-bold">Start Building</Link>
                <Link to="/submission" className="border border-enerblock-dark text-enerblock-dark px-8 py-4 rounded-none hover:bg-enerblock-dark hover:text-white transition-colors text-sm uppercase tracking-widest font-bold text-center block">Download Runner</Link>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="border-l border-enerblock-dark/20 pl-6 lg:pl-12 flex flex-col justify-end pb-12 lg:pb-24">
          <Reveal delay={0.2}>
            <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-md text-enerblock-dark">Upload your repository and let BlueOps decode your project's DNA. We build a comprehensive Deployment Blueprint, generate production-ready artifacts, and execute precisely via the BlueOps Runner.</p>
            <Link className="inline-flex items-center mt-8 text-enerblock-dark font-bold hover:underline" to="/submission">
              Get Started 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </Link>
          </Reveal>
        </div>
      </div>
      <div className="mt-12">
        <Reveal delay={0.3}>
          <img alt="Repository dependency map visualization" className="w-full h-[614px] object-cover rounded-none grayscale opacity-90 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida/AP1WRLuh5oqp3qd6nA8FqqD7GloSNAO4YPvzo8UhLYd4jXOYVtaPCGi9E_3gn0mPKXouDUM0rZGL4wz_RZkKIvLk9JJPu6N68jl2k7F_F0jQFKy7u-Mo1-WOYCAlveeZTVLU9JDL5Tnv7UgUCy0CbE-uYHXMgr-gypOgt9JU9HlHbvgFiwRZmKR3wZ0YO51e1zjPCeSy3oEczfDygApGAEAyUiz1ObJ2obVgWZwwiG_XP89s8dST6aMeIe7H-h-U"/>
          <p className="text-xs uppercase tracking-widest mt-4 text-enerblock-dark/60 mono">Fig. 01 — Repository Intelligence Map</p>
        </Reveal>
      </div>
    </header>
  );
}
