import { Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import CategoryExplorer from '../components/intelligence/CategoryExplorer';

export default function Intelligence() {
  return (
    <div className="bg-enerblock-light text-enerblock-dark min-h-screen flex flex-col font-sans">
      <Navigation />

      <main className="flex-grow pt-40 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter text-enerblock-dark mb-8">
                Analysis Complete.
              </h1>
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-enerblock-dark/70 max-w-3xl">
                BlueOps has thoroughly analyzed your repository. The core architectural components, boundaries, and dependencies have been understood.
              </p>
            </div>
            <div className="shrink-0 pb-2">
              <Link
                to="/blueprint-studio"
                className="bg-enerblock-dark text-white hover:bg-enerblock-red hover:text-white px-8 py-4 rounded-none text-xs font-mono font-bold uppercase tracking-widest inline-flex items-center group shadow-xl transition-all duration-300"
              >
                Open Blueprint Studio
                <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
          </header>

          {/* Explorer Section */}
          <CategoryExplorer />
        </div>
      </main>

      <Footer />
    </div>
  );
}
