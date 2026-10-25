import { Handle, Position } from '@xyflow/react';
import { Database, Server, Globe, HardDrive, Key, Webhook, Activity, Monitor, Boxes, Calendar, Link } from 'lucide-react';

const ICONS = {
  frontend: Globe,
  backend: Server,
  api: Webhook,
  database: Database,
  cache: HardDrive,
  queue: Activity,
  secret: Key,
  monitoring: Monitor,
  worker: Boxes,
  volume: HardDrive,
  external: Link,
  scheduler: Calendar,
};

export default function CustomBlueprintNode({ data, selected, type }) {
  // Use the React Flow type directly, which corresponds to our DSML types
  const nodeType = type;
  const Icon = ICONS[nodeType] || Server;

  const renderShape = () => {
    switch (nodeType) {
      case 'database':
      case 'cache':
      case 'volume':
        return (
          <div className="flex flex-col drop-shadow-md">
             <div className={`h-6 rounded-[50%] border-b -mb-3 z-10 border-2 border-b-0 ${selected ? 'bg-enerblock-red text-white border-enerblock-dark/20' : 'bg-white text-enerblock-dark border-enerblock-dark/20'}`}></div>
             <div className={`p-5 pt-6 pb-6 text-center border-2 border-t-0 border-b-0 ${selected ? 'bg-enerblock-red text-white border-enerblock-dark/20' : 'bg-white text-enerblock-dark border-enerblock-dark/20'}`}>
                <Icon size={24} strokeWidth={2} className="mx-auto mb-2 opacity-90" />
                <div className="text-sm font-bold truncate headline tracking-tight">{data.name}</div>
                <div className="text-[10px] uppercase tracking-widest mono opacity-70 mt-1">{data.engine || nodeType}</div>
             </div>
             <div className={`h-6 rounded-[50%] -mt-3 z-10 border-2 border-t-0 ${selected ? 'bg-enerblock-red border-enerblock-dark/20' : 'bg-white border-enerblock-dark/20'}`}></div>
          </div>
        );
      
      case 'queue':
        return (
          <div className={`p-4 flex items-center justify-center flex-col h-[100px] rounded-full border-2 shadow-md ${selected ? 'bg-enerblock-red border-enerblock-red text-white' : 'bg-white border-enerblock-dark/20 text-enerblock-dark'}`}>
             <Icon size={20} strokeWidth={2} className="mb-1" />
             <div className="text-xs font-bold truncate headline w-24 text-center tracking-tight">{data.name}</div>
          </div>
        );
        
      case 'monitoring':
      case 'secret':
        return (
           <div className="w-[160px] h-[160px] flex items-center justify-center relative shadow-md">
             <div className={`absolute inset-2 rotate-45 border-2 transition-colors ${selected ? 'bg-enerblock-red border-enerblock-red' : 'bg-white border-enerblock-dark/20'}`}></div>
             <div className={`relative z-10 text-center flex flex-col items-center ${selected ? 'text-white' : 'text-enerblock-dark'}`}>
                <Icon size={24} strokeWidth={2} className="mb-2" />
                <div className="text-sm font-bold truncate headline w-24 tracking-tight">{data.name}</div>
             </div>
           </div>
        );

      case 'external':
        return (
          <div className={`p-4 flex flex-col h-[90px] bg-enerblock-light/50 border-2 border-dashed ${selected ? 'border-enerblock-red shadow-inner' : 'border-enerblock-dark/40'}`}>
            <div className="flex items-center gap-3">
              <Icon size={18} strokeWidth={1.5} className={selected ? 'text-enerblock-red' : 'text-enerblock-dark/60'} />
              <div className="text-base font-bold truncate headline text-enerblock-dark">{data.name}</div>
            </div>
            <div className="text-[10px] uppercase tracking-widest mono text-enerblock-dark/50 mt-auto">External Reference</div>
          </div>
        );
        
      case 'worker':
      case 'scheduler':
      case 'backend':
      case 'frontend':
      case 'api':
      default:
        return (
          <div className={`p-4 flex flex-col h-[100px] bg-white border-2 shadow-md ${selected ? 'border-enerblock-red' : 'border-enerblock-dark/20'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 border border-enerblock-dark/10 ${selected ? 'bg-enerblock-red text-white border-transparent' : 'bg-enerblock-light text-enerblock-dark'} transition-colors duration-300`}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-base font-bold truncate headline tracking-tight text-enerblock-dark">{data.name}</div>
                <div className="text-[10px] uppercase tracking-widest mono text-enerblock-dark/50 mt-0.5">{nodeType}</div>
              </div>
            </div>
            <div className="mt-auto pt-3 border-t border-enerblock-dark/10 flex justify-between items-center text-[10px] mono font-bold">
               <span className="text-enerblock-dark/50 uppercase tracking-widest">{data.framework || 'runtime'}</span>
               <span className="bg-enerblock-light text-enerblock-dark px-2 py-0.5 border border-enerblock-dark/10">
                 rep: {data.replicas || '1'}
               </span>
            </div>
          </div>
        );
    }
  };

  const getWidth = () => {
     if (nodeType === 'database' || nodeType === 'cache' || nodeType === 'queue' || nodeType === 'monitoring' || nodeType === 'secret') return 'w-[160px]';
     return 'w-[240px]';
  };

  const heightAdjust = () => {
    if (nodeType === 'monitoring' || nodeType === 'secret') return '-translate-y-6';
    return '';
  };

  return (
    <div
      className={`relative ${getWidth()} transition-all duration-300 overflow-visible ${heightAdjust()}
        ${selected ? 'scale-105 z-20' : 'hover:scale-[1.02] z-10'}`}
    >
      <div className={`w-full h-full ${selected ? 'drop-shadow-2xl' : 'drop-shadow-xl'}`}>
        {renderShape()}
      </div>
      
      {/* Semantic Connection Points replacing default React Flow handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left"
        className={`!absolute !top-1/2 !-left-2 !w-4 !h-4 !rounded-none !border-2 !bg-white !-translate-y-1/2 !shadow-sm !transition-colors !cursor-crosshair !z-30 !min-w-0 !min-h-0 ${selected ? '!border-enerblock-red' : '!border-enerblock-dark/20'}`}
        isConnectable={true}
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
        className={`!absolute !top-1/2 !-right-2 !w-4 !h-4 !rounded-none !border-2 !bg-white !-translate-y-1/2 !shadow-sm !transition-colors !cursor-crosshair !z-30 !min-w-0 !min-h-0 ${selected ? '!border-enerblock-red' : '!border-enerblock-dark/20'}`}
        isConnectable={true}
      />
    </div>
  );
}
