import Navigation from '../components/layout/Navigation';
import Hero from '../components/landing/Hero';
import Impact from '../components/landing/Impact';
import Benefits from '../components/landing/Benefits';
import ProcessSteps from '../components/landing/ProcessSteps';
import WorkflowVisual from '../components/landing/WorkflowVisual';
import SystemSection from '../components/landing/SystemSection';
import Footer from '../components/layout/Footer';

export default function Landing() {
  return (
    <div className="bg-enerblock-light text-enerblock-dark overflow-x-hidden">
      <Navigation />
      <Hero />
      <Impact />
      <Benefits />
      <ProcessSteps />
      <WorkflowVisual />
      <SystemSection />
      <Footer />
    </div>
  );
}
