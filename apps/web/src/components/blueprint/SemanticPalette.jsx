import { useBlueprint } from '../../context/BlueprintContext';
import { Database, Server, Monitor, Globe, HardDrive, Key, Webhook, Activity, Boxes, Calendar, Link } from 'lucide-react';

const COMPONENTS = [
  { type: 'frontend', label: 'Frontend App', icon: Globe },
  { type: 'backend', label: 'Backend Service', icon: Server },
  { type: 'api', label: 'API Gateway', icon: Webhook },
  { type: 'database', label: 'Database', icon: Database },
  { type: 'cache', label: 'Cache', icon: HardDrive },
  { type: 'queue', label: 'Message Queue', icon: Activity },
  { type: 'secret', label: 'Secret Store', icon: Key },
  { type: 'monitoring', label: 'Monitoring', icon: Monitor },
  { type: 'worker', label: 'Background Worker', icon: Boxes },
  { type: 'volume', label: 'Persistent Volume', icon: HardDrive },
  { type: 'external', label: 'External Service', icon: Link },
  { type: 'scheduler', label: 'Task Scheduler', icon: Calendar },
];

function SemanticPalette() {
  const { setDraggedNodeType } = useBlueprint();

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('application/blueops-node', type);
    setDraggedNodeType(type);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3">
      <div className="text-xs uppercase tracking-widest font-bold mono text-enerblock-red mb-6 flex items-center gap-2">
        <span className="w-4 h-px bg-enerblock-red"></span>
        Application Tier
      </div>
      
      {COMPONENTS.map((comp) => {
        const Icon = comp.icon;
        return (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
            className="flex items-center gap-4 p-4 rounded-none bg-white border border-enerblock-dark/20 hover:bg-enerblock-dark hover:border-enerblock-dark hover:text-white cursor-grab active:cursor-grabbing transition-all duration-300 group shadow-sm hover:shadow-xl"
          >
            <div className="text-enerblock-red group-hover:text-white transition-colors duration-300">
              <Icon size={20} strokeWidth={2} />
            </div>
            <span className="text-base font-bold tracking-tight headline group-hover:text-enerblock-red transition-colors">{comp.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default SemanticPalette;
