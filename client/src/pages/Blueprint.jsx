import { useState } from "react";
import { BlueprintProvider } from '../context/BlueprintContext';
import SemanticPalette from '../components/blueprint/SemanticPalette';
import BlueprintWorkspace from '../components/blueprint/BlueprintWorkspace';
import PropertiesInspector from '../components/blueprint/PropertiesInspector';
import InfrastructureShadow from '../components/blueprint/InfrastructureShadow';
import Navigation from '../components/layout/Navigation';

function Blueprint() {
  const [showShadow, setShowShadow] = useState(false);

  return (
    <BlueprintProvider>
      <div className="min-h-screen bg-enerblock-light text-enerblock-dark flex flex-col overflow-hidden">
        {/* Navigation - global nav */}
        <Navigation theme="light" />

        {/* Blueprint Studio Layout */}
        <div className="flex-1 flex flex-col pt-[84px] relative">
          
          {/* Main IDE area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Palette */}
            <div className="w-72 flex-shrink-0 z-10 flex flex-col bg-white border-r border-enerblock-dark/20 shadow-2xl">
              <div className="p-6 border-b border-enerblock-dark/20 bg-enerblock-light/50">
                <h2 className="text-xl font-bold tracking-tighter headline text-enerblock-dark">Semantic Palette</h2>
                <p className="text-xs text-enerblock-dark/60 mt-2 font-mono uppercase tracking-widest">Drag components</p>
              </div>
              <SemanticPalette />
            </div>

            {/* Center Canvas - Workspace */}
            <div className="flex-1 relative bg-enerblock-light overflow-hidden">
              <BlueprintWorkspace />
              
              {/* Overlay Toggle for Infrastructure Shadow */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                <button 
                  onClick={() => setShowShadow(!showShadow)}
                  className={`px-8 py-4 rounded-none text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-3 shadow-xl ${
                    showShadow 
                    ? 'bg-enerblock-dark text-white hover:bg-enerblock-red' 
                    : 'bg-enerblock-red text-white hover:bg-enerblock-dark'
                  }`}
                >
                  <span className="w-2 h-2 rounded-none bg-white animate-pulse"></span>
                  {showShadow ? 'Hide Infrastructure Shadow' : 'View Infrastructure Shadow'}
                </button>
              </div>
            </div>

            {/* Right Sidebar - Inspector */}
            <div className="w-96 flex-shrink-0 z-10 flex flex-col bg-white border-l border-enerblock-dark/20 shadow-2xl">
              <div className="p-6 border-b border-enerblock-dark/20 bg-enerblock-light/50">
                <h2 className="text-xl font-bold tracking-tighter headline text-enerblock-dark">Properties Inspector</h2>
                <p className="text-xs text-enerblock-dark/60 mt-2 font-mono uppercase tracking-widest">Configure requirements</p>
              </div>
              <PropertiesInspector />
            </div>
          </div>

          {/* Infrastructure Shadow Panel (Collapsible Bottom Panel) */}
          <div className={`absolute bottom-0 left-72 right-96 bg-enerblock-dark text-white border-t border-enerblock-red/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 shadow-2xl flex flex-col ${showShadow ? 'h-72 translate-y-0 opacity-100' : 'h-0 translate-y-full opacity-0 pointer-events-none'}`}>
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-sm font-bold tracking-widest uppercase mono flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red"></span>
                Infrastructure Shadow
              </h2>
              <button onClick={() => setShowShadow(false)} className="text-xs uppercase tracking-widest font-bold text-white/50 hover:text-enerblock-red transition-colors mono">
                [Close]
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-enerblock-dark">
               <InfrastructureShadow />
            </div>
          </div>

        </div>
      </div>
    </BlueprintProvider>
  );
}

export default Blueprint;
