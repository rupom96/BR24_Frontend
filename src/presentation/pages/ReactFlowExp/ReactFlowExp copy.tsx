import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type Props = {};

const initialEdges = [
  {
    id: '1-2',
    source: '1',
    target: '2',
    // label: '1-2',
    // type: 'step',
    animated: true,
  },
  {
    id: '2-1',
    source: '2',
    target: '1',
    // label: '2-1',
    // type: 'step',
    animated: true,
  },
  {
    id: '1-3',
    source: '1',
    target: '3',
    label: '1-3',
    // type: 'step',
    animated: true,
  },
];
const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Procurement Requisition' },
    // type: 'input',
  },
  {
    id: '2',
    position: { x: 250, y: 250 },
    data: { label: 'PQ Approval' },
  },
  {
    id: '3',
    position: { x: 300, y: 300 },
    data: { label: 'World' },
  },
];

// const initialNodes = [
//   {
//     id: '1',
//     data: { label: 'Hello' },
//     position: { x: 0, y: 0 },
//     type: 'input',
//   },
//   {
//     id: '2',
//     data: { label: 'World' },
//     position: { x: 100, y: 100 },
//   },
// ];

// const initialEdges = [
//   { id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' },
// ];

const ReactFlowExp = (props: Props) => {
  const [nodes, setNodes] = useState([...initialNodes]);
  const [edges, setEdges] = useState([...initialEdges]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="mt-10 ml-10 z-40 ">
      hell
      <div style={{ width: '90%', height: '60vh' }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ReactFlowExp;
