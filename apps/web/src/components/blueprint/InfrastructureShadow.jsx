import { useBlueprint } from '../../context/BlueprintContext';
import { Box, Cpu, Cloud, Terminal, HardDrive, Globe } from 'lucide-react';

function InfrastructureShadow() {
  const { selectedNode } = useBlueprint();

  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center text-white/40 text-sm font-medium">
        Select a component in the Blueprint to view its infrastructure shadow.
      </div>
    );
  }

  // Generate a mock shadow based on node type
  let shadowChain;

  if (selectedNode.type === 'backend' || selectedNode.type === 'frontend' || selectedNode.type === 'api') {
    shadowChain = [
      { id: 1, name: 'Docker Image', icon: Box, tech: 'Container' },
      { id: 2, name: 'Kubernetes Deployment', icon: Cpu, tech: 'Compute' },
      { id: 3, name: 'Kubernetes Service', icon: Cloud, tech: 'Networking' },
      { id: 4, name: 'Ingress Resource', icon: Globe, tech: 'Routing' }
    ];
  } else if (selectedNode.type === 'database') {
    shadowChain = [
      { id: 1, name: 'StatefulSet', icon: Cpu, tech: 'Compute' },
      { id: 2, name: 'PersistentVolumeClaim', icon: HardDrive, tech: 'Storage' },
      { id: 3, name: 'Headless Service', icon: Cloud, tech: 'Networking' }
    ];
  } else {
    shadowChain = [
      { id: 1, name: 'Helm Chart Release', icon: Box, tech: 'Package' }
    ];
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="text-sm text-white mb-8 flex items-center gap-3 font-medium">
        <span className="opacity-60">Derived Infrastructure for:</span>
        <span className="font-mono bg-white/10 px-3 py-1.5 rounded-none">{selectedNode.data.name}</span>
      </div>

      <div className="flex items-center gap-6 flex-1 overflow-x-auto pb-4">
        {/* Blueprint Origin */}
        <div className="shrink-0 flex flex-col items-center justify-center w-36 h-36 bg-enerblock-dark border border-enerblock-red/40 rounded-none relative shadow-2xl">
          <div className="absolute top-3 text-[10px] font-bold uppercase tracking-widest text-enerblock-red mono">Origin</div>
          <div className="text-white mt-4 mb-3"><Box size={32} strokeWidth={1.5} /></div>
          <div className="text-sm text-white text-center font-bold headline px-2">{selectedNode.data.name}</div>
        </div>

        {shadowChain.map((step) => (
          <div key={step.id} className="flex items-center">
            <div className="shrink-0 w-8 h-px bg-white/20 relative">
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/40 rounded-none border border-white"></div>
            </div>
            
            <div className="shrink-0 flex flex-col items-center justify-center w-48 h-36 bg-enerblock-dark border border-white/10 rounded-none relative group hover:border-white/40 hover:bg-white/5 transition-all duration-300">
              <step.icon className="text-white/60 mb-3 group-hover:text-white transition-colors" size={32} strokeWidth={1.5} />
              <div className="text-base text-white text-center font-bold px-4 headline">{step.name}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest mt-2 mono">{step.tech}</div>
            </div>
          </div>
        ))}
        
        <div className="shrink-0 w-8 h-px bg-white/20 relative">
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/40 rounded-none border border-white"></div>
        </div>
        
        {/* Terraform Destination */}
        <div className="shrink-0 flex flex-col items-center justify-center w-40 h-36 bg-enerblock-red text-white rounded-none relative shadow-[0_0_30px_rgba(255,77,77,0.3)] hover:-translate-y-1 transition-transform duration-300">
           <Terminal className="text-white mb-3" size={32} strokeWidth={1.5} />
           <div className="text-base text-white text-center font-bold headline">Terraform</div>
           <div className="text-[10px] text-white/80 uppercase tracking-widest mt-2 mono">Execution</div>
        </div>
      </div>
    </div>
  );
}

export default InfrastructureShadow;
