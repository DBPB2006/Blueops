/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const BlueprintContext = createContext();

export function BlueprintProvider({ children }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]); // renamed from connections to edges
  
  // Selection state will be primarily driven by React Flow's onSelectionChange,
  // but we can keep track of it here for the properties inspector.
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null); // renamed
  
  const [draggedNodeType, setDraggedNodeType] = useState(null);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const addNode = useCallback((node) => {
    // Ensure position structure
    const rfNode = {
      ...node,
      position: { x: node.x || 0, y: node.y || 0 },
    };
    setNodes((prev) => [...prev, rfNode]);
  }, []);

  const updateNodeData = useCallback((id, data) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n))
    );
  }, []);

  const removeNode = useCallback((id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addConnection = useCallback((connection) => {
    // Add default properties to new connections
    const enhancedConn = {
      id: connection.id || `conn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...connection, // connection should now provide `source` and `target` 
      source: connection.source || connection.sourceId,
      target: connection.target || connection.targetId,
      type: 'customEdge',
      data: {
        type: 'Depends On',
        connectionType: 'HTTP',
        retries: '0',
        transactional: 'No',
        healthDependency: 'Required'
      }
    };
    setEdges((prev) => [...prev, enhancedConn]);
  }, []);

  const updateConnectionData = useCallback((id, data) => {
    setEdges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, data: { ...c.data, ...data } } : c))
    );
  }, []);

  const removeConnection = useCallback((id) => {
    setEdges((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedConnection = edges.find((c) => c.id === selectedEdgeId) || null;

  return (
    <BlueprintContext.Provider
      value={{
        nodes,
        edges,
        connections: edges, // for backwards compatibility with parts that might use it
        onNodesChange,
        onEdgesChange,
        selectedNodeId,
        selectedNode,
        selectedConnectionId: selectedEdgeId,
        selectedConnection,
        draggedNodeType,
        setDraggedNodeType,
        setSelectedNodeId,
        setSelectedConnectionId: setSelectedEdgeId,
        setNodes,
        setEdges,
        addNode,
        updateNodeData,
        removeNode,
        addConnection,
        updateConnectionData,
        removeConnection,
      }}
    >
      {children}
    </BlueprintContext.Provider>
  );
}

export function useBlueprint() {
  const context = useContext(BlueprintContext);
  if (!context) {
    throw new Error('useBlueprint must be used within a BlueprintProvider');
  }
  return context;
}
