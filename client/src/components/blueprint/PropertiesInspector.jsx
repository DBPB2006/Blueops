import { useBlueprint } from '../../context/BlueprintContext';

function PropertiesInspector() {
  const { selectedNode, updateNodeData, selectedConnection, updateConnectionData } = useBlueprint();

  if (!selectedNode && !selectedConnection) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center opacity-70">
        <div className="w-16 h-16 rounded-none bg-enerblock-light flex items-center justify-center mb-6 shadow-inner">
          <svg className="w-6 h-6 text-enerblock-dark/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <p className="text-sm font-medium text-enerblock-dark/60 max-w-[200px]">Select a component or relationship to configure application intent.</p>
      </div>
    );
  }

  const handleNodeChange = (e) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, { [e.target.name]: e.target.value });
    }
  };

  const handleConnChange = (e) => {
    if (selectedConnection) {
      updateConnectionData(selectedConnection.id, { [e.target.name]: e.target.value });
    }
  };

  const inputStyles = "w-full bg-white border-2 border-enerblock-dark/20 shadow-sm focus:shadow-md rounded-none px-4 py-3 text-sm text-enerblock-dark focus:outline-none focus:bg-white focus:border-enerblock-red focus:ring-1 focus:ring-enerblock-red transition-all duration-300";
  const labelStyles = "block text-[10px] font-bold text-enerblock-dark/70 uppercase tracking-widest mb-2 mono flex items-center gap-2";

  // Render Connection Properties
  if (selectedConnection) {
    const data = selectedConnection.data || {};
    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-enerblock-light/20">
        <div className="pb-4 border-b border-enerblock-dark/10 mb-8">
          <h3 className="text-xl font-bold tracking-tighter headline text-enerblock-red">Relationship Edge</h3>
          <p className="text-[10px] uppercase tracking-widest mono text-enerblock-dark/50 mt-1">Defines Deployment Semantics</p>
        </div>
        
        <div className="space-y-8">
          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Semantic Type
            </label>
            <select name="type" value={data.type || 'Depends On'} onChange={handleConnChange} className={inputStyles}>
              <option value="Depends On">Depends On</option>
              <option value="Routes To">Routes To</option>
              <option value="Reads From">Reads From</option>
              <option value="Writes To">Writes To</option>
              <option value="Publishes To">Publishes To</option>
              <option value="Consumes From">Consumes From</option>
              <option value="Mounts">Mounts</option>
              <option value="Authenticates With">Authenticates With</option>
            </select>
          </div>

          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Connection Protocol
            </label>
            <select name="connectionType" value={data.connectionType || 'HTTP'} onChange={handleConnChange} className={inputStyles}>
              <option value="HTTP">HTTP/HTTPS</option>
              <option value="gRPC">gRPC</option>
              <option value="TCP">TCP Socket</option>
              <option value="AMQP">AMQP</option>
              <option value="JDBC">JDBC / DB Link</option>
            </select>
          </div>

          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Retries
            </label>
            <input type="number" name="retries" value={data.retries || '0'} onChange={handleConnChange} className={inputStyles} min="0" max="10" />
          </div>

          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Transactional
            </label>
            <select name="transactional" value={data.transactional || 'No'} onChange={handleConnChange} className={inputStyles}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Health Dependency
            </label>
            <select name="healthDependency" value={data.healthDependency || 'Required'} onChange={handleConnChange} className={inputStyles}>
              <option value="Required">Required (Block startup)</option>
              <option value="Optional">Optional (Continue startup)</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // Render Node Properties
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      <div>
        <label className={labelStyles}>
          <span className="w-1.5 h-1.5 rounded-none bg-enerblock-dark/30"></span>
          Component Name
        </label>
        <input 
          type="text" 
          name="name"
          value={selectedNode.data.name || ''} 
          onChange={handleNodeChange}
          className={inputStyles}
        />
      </div>

      {(selectedNode.type === 'backend' || selectedNode.type === 'frontend' || selectedNode.type === 'api' || selectedNode.type === 'worker' || selectedNode.type === 'scheduler') && (
        <div className="space-y-8">
          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Framework / Runtime
            </label>
            <select name="framework" value={selectedNode.data.framework || 'node'} onChange={handleNodeChange} className={inputStyles}>
              <option value="node">Node.js</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="java">Java</option>
              <option value="ruby">Ruby</option>
              <option value="rust">Rust</option>
            </select>
          </div>
          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Internal Port
            </label>
            <input type="number" name="port" value={selectedNode.data.port || ''} onChange={handleNodeChange} placeholder="e.g. 8080" className={inputStyles} />
          </div>
          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Replicas
            </label>
            <input type="number" name="replicas" value={selectedNode.data.replicas || '1'} onChange={handleNodeChange} className={inputStyles} min="1" max="100" />
          </div>
        </div>
      )}

      {(selectedNode.type === 'database' || selectedNode.type === 'cache') && (
        <div className="space-y-8">
          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Engine
            </label>
            <select name="engine" value={selectedNode.data.engine || 'postgres'} onChange={handleNodeChange} className={inputStyles}>
              <option value="postgres">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="mongo">MongoDB</option>
              <option value="redis">Redis</option>
            </select>
          </div>
          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Persistence Strategy
            </label>
            <select name="persistence" value={selectedNode.data.persistence || 'persistent'} onChange={handleNodeChange} className={inputStyles}>
              <option value="persistent">Persistent Volume</option>
              <option value="ephemeral">Ephemeral (Cache only)</option>
            </select>
          </div>
        </div>
      )}
      
      {selectedNode.type === 'volume' && (
        <div className="space-y-8">
          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Storage Class
            </label>
            <select name="storageClass" value={selectedNode.data.storageClass || 'standard'} onChange={handleNodeChange} className={inputStyles}>
              <option value="standard">Standard (gp2/pd-standard)</option>
              <option value="premium">Premium (io1/pd-ssd)</option>
            </select>
          </div>
          <div>
            <label className={labelStyles}>
              <span className="w-1.5 h-1.5 rounded-none bg-enerblock-red/60"></span>
              Capacity (GB)
            </label>
            <input type="number" name="capacity" value={selectedNode.data.capacity || '10'} onChange={handleNodeChange} className={inputStyles} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertiesInspector;
