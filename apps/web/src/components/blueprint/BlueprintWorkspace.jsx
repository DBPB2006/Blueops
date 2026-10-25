import { useRef, useCallback, useEffect, useState } from "react";
import { ReactFlow, Background, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useBlueprint } from '../../context/BlueprintContext';
import { Globe, Save, Check, AlertCircle } from 'lucide-react';
import CustomBlueprintNode from './CustomBlueprintNode';
import CustomBlueprintEdge from './CustomBlueprintEdge';
import { getBlueprint, updateBlueprint } from '../../services/api';

const nodeTypes = {
  frontend: CustomBlueprintNode,
  backend: CustomBlueprintNode,
  api: CustomBlueprintNode,
  database: CustomBlueprintNode,
  cache: CustomBlueprintNode,
  queue: CustomBlueprintNode,
  secret: CustomBlueprintNode,
  monitoring: CustomBlueprintNode,
  worker: CustomBlueprintNode,
  volume: CustomBlueprintNode,
  external: CustomBlueprintNode,
  scheduler: CustomBlueprintNode,
  customNode: CustomBlueprintNode,
};

const edgeTypes = {
  customEdge: CustomBlueprintEdge,
};

function BlueprintWorkspaceContent() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    addNode, 
    addConnection,
    draggedNodeType,
    setDraggedNodeType,
    setSelectedNodeId,
    setSelectedConnectionId,
    setNodes,
    setEdges
  } = useBlueprint();

  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition, getViewport, setViewport } = useReactFlow();
  
  const [saveStatus, setSaveStatus] = useState('');
  
  // For testing, mock a project ID if none is available
  const projectId = localStorage.getItem('currentProjectId') || 'mock-project-id';

  // HYDRATION
  useEffect(() => {
    let mounted = true;
    const fetchBlueprint = async () => {
      try {
        const bp = await getBlueprint(projectId);
        if (mounted && bp && bp.graph) {
          if (bp.graph.nodes) setNodes(bp.graph.nodes);
          if (bp.graph.edges) setEdges(bp.graph.edges);
          if (bp.graph.viewport) setViewport(bp.graph.viewport);
        }
      } catch (err) {
        console.error("Failed to load blueprint:", err);
      }
    };
    fetchBlueprint();
    return () => { mounted = false; };
  }, [projectId, setNodes, setEdges, setViewport]);

  // AUTOSAVE
  useEffect(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    
    setSaveStatus('saving');
    const timeoutId = setTimeout(async () => {
      try {
        await updateBlueprint(projectId, {
          graph: { nodes, edges, viewport: getViewport() }
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (err) {
        console.error("Autosave failed:", err);
        setSaveStatus('error');
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, getViewport, projectId]);

  const onConnect = useCallback((params) => {
    addConnection(params);
  }, [addConnection]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/blueops-node') || draggedNodeType;

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Shift position slightly to center drop
      position.x -= 120;
      position.y -= 40;

      const newNode = {
        id: `node-${Date.now()}`,
        type: type, // use the actual type so React Flow and our properties inspector know what it is
        position,
        data: { name: `New ${type}` },
      };

      addNode(newNode);
      setDraggedNodeType(null);
    },
    [screenToFlowPosition, draggedNodeType, setDraggedNodeType, addNode],
  );
  
  const onSelectionChange = useCallback(({ nodes, edges }) => {
     if (nodes.length > 0) {
        setSelectedNodeId(nodes[0].id);
        setSelectedConnectionId(null);
     } else if (edges.length > 0) {
        setSelectedConnectionId(edges[0].id);
        setSelectedNodeId(null);
     } else {
        setSelectedNodeId(null);
        setSelectedConnectionId(null);
     }
  }, [setSelectedNodeId, setSelectedConnectionId]);

  return (
    <div className="absolute inset-0 w-full h-full bg-enerblock-light" ref={reactFlowWrapper}>
      {/* Save Status Indicator */}
      {saveStatus && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded bg-white shadow-sm border border-enerblock-dark/10 text-xs font-bold mono uppercase tracking-widest">
          {saveStatus === 'saving' && <><Save size={14} className="text-enerblock-dark/50 animate-pulse" /><span className="text-enerblock-dark/70">Saving...</span></>}
          {saveStatus === 'saved' && <><Check size={14} className="text-green-500" /><span className="text-green-600">Saved</span></>}
          {saveStatus === 'error' && <><AlertCircle size={14} className="text-red-500" /><span className="text-red-600">Save Error</span></>}
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode="loose"
        fitView={false}
        snapToGrid
        snapGrid={[16, 16]}
        className="!bg-transparent"
        proOptions={{ hideAttribution: true }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        {/* Clean, subtle, and modern dot grid */}
        <Background variant="dots" gap={24} size={1.5} color="#0f0f0f" style={{ opacity: 0.15 }} />
      </ReactFlow>

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
          <div className="w-24 h-24 mx-auto mb-6 border border-enerblock-dark/10 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-xl">
            <Globe className="text-enerblock-red opacity-80" size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter headline text-enerblock-dark mb-4">Design your deployment.</h3>
          <p className="text-sm uppercase tracking-widest font-bold mono text-enerblock-dark/60">Drag components from the semantic palette to begin</p>
        </div>
      )}
    </div>
  );
}

export default function BlueprintWorkspace() {
  return (
    <ReactFlowProvider>
      <BlueprintWorkspaceContent />
    </ReactFlowProvider>
  );
}
