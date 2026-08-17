/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  NodeProps,
  BezierEdge,
  StepEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './ReactFlowExp.css';
import { Tooltip } from '@mui/material';

type Props = {};

interface Task {
  id: string;
  name: string;
  status: 'completed' | 'pending';
  duration: string;
  next: string[]; // IDs of next tasks
}

interface Event {
  id: string;
  eventNo: string;
  tasks: Task[];
}

interface FlowchartState {
  events: Event[];
}

const events: Event[] = [
  {
    id: '1',
    eventNo: 'LC-001',
    tasks: [
      {
        id: '1001',
        name: 'Procurement Requisition',
        status: 'completed',
        duration: '7days',
        next: ['1002', '1003'],
      },
      {
        id: '1002',
        name: 'Procurement Requisition Approval 1',
        status: 'completed',
        duration: '7days',
        next: ['1003'],
      },
      {
        id: '1003',
        name: 'Procurement Requisition Approval 2',
        status: 'completed',
        duration: '7days',
        next: ['1004'],
      },
      {
        id: '1004',
        name: 'Purchase Order',
        status: 'completed',
        duration: '7days',
        next: ['1005'],
      },
      {
        id: '1005',
        name: 'Purchase Order Approval',
        status: 'completed',
        duration: '7days',
        next: ['1001'],
      },
      {
        id: '1006',
        name: 'Purchase Order Approval',
        status: 'completed',
        duration: '7days',
        next: [],
      },
      {
        id: '1007',
        name: 'Purchase Order Approval',
        status: 'completed',
        duration: '7days',
        next: [],
      },
      {
        id: '1008',
        name: 'Purchase Order Approval',
        status: 'completed',
        duration: '7days',
        next: [],
      },
    ],
  },
  {
    id: '2',
    eventNo: 'LC-002',
    tasks: [
      {
        id: '2001',
        name: 'Procurement Requisition',
        status: 'completed',
        duration: '7days',
        next: ['2002'],
      },
      {
        id: '2002',
        name: 'Procurement Requisition Approval 1',
        status: 'completed',
        duration: '7days',
        next: ['2003'],
      },
      {
        id: '2003',
        name: 'Procurement Requisition Approval 2',
        status: 'completed',
        duration: '7days',
        next: ['2004'],
      },
      {
        id: '2004',
        name: 'Purchase Order',
        status: 'completed',
        duration: '7days',
        next: [],
      },
    ],
  },
  {
    id: '2',
    eventNo: 'LC-002',
    tasks: [
      {
        id: '2001',
        name: 'Procurement Requisition',
        status: 'completed',
        duration: '7days',
        next: ['2002'],
      },
      {
        id: '2002',
        name: 'Procurement Requisition Approval 1',
        status: 'completed',
        duration: '7days',
        next: ['2003'],
      },
      {
        id: '2003',
        name: 'Procurement Requisition Approval 2',
        status: 'completed',
        duration: '7days',
        next: ['2004'],
      },
      {
        id: '2004',
        name: 'Purchase Order',
        status: 'completed',
        duration: '7days',
        next: [],
      },
    ],
  },
  {
    id: '2',
    eventNo: 'LC-002',
    tasks: [
      {
        id: '2001',
        name: 'Procurement Requisition',
        status: 'completed',
        duration: '7days',
        next: ['2002'],
      },
      {
        id: '2002',
        name: 'Procurement Requisition Approval 1',
        status: 'completed',
        duration: '7days',
        next: ['2003'],
      },
      {
        id: '2003',
        name: 'Procurement Requisition Approval 2',
        status: 'completed',
        duration: '7days',
        next: ['2004'],
      },
      {
        id: '2004',
        name: 'Purchase Order',
        status: 'completed',
        duration: '7days',
        next: [],
      },
    ],
  },
  {
    id: '2',
    eventNo: 'LC-002',
    tasks: [
      {
        id: '2001',
        name: 'Procurement Requisition',
        status: 'completed',
        duration: '7days',
        next: ['2002'],
      },
      {
        id: '2002',
        name: 'Procurement Requisition Approval 1',
        status: 'completed',
        duration: '7days',
        next: ['2003', '2001'],
      },
      {
        id: '2003',
        name: 'Procurement Requisition Approval 2',
        status: 'completed',
        duration: '7days',
        next: ['2004'],
      },
      {
        id: '2004',
        name: 'Purchase Order',
        status: 'completed',
        duration: '7days',
        next: [],
      },
    ],
  },
  {
    id: '2',
    eventNo: 'LC-002',
    tasks: [
      {
        id: '2001',
        name: 'Procurement Requisition',
        status: 'completed',
        duration: '7days',
        next: ['2002'],
      },
      {
        id: '2002',
        name: 'Procurement Requisition Approval 1',
        status: 'completed',
        duration: '7days',
        next: ['2003'],
      },
      {
        id: '2003',
        name: 'Procurement Requisition Approval 2',
        status: 'completed',
        duration: '7days',
        next: ['2004'],
      },
      {
        id: '2004',
        name: 'Purchase Order',
        status: 'completed',
        duration: '7days',
        next: [],
      },
    ],
  },
  {
    id: '2',
    eventNo: 'LC-002',
    tasks: [
      {
        id: '2001',
        name: 'Procurement Requisition',
        status: 'completed',
        duration: '7days',
        next: ['2002'],
      },
      {
        id: '2002',
        name: 'ProcurementRequisitionApproval 1',
        status: 'completed',
        duration: '7days',
        next: ['2003'],
      },
      {
        id: '2003',
        name: 'Procurement Requisition Approval 2',
        status: 'completed',
        duration: '7days',
        next: ['2004'],
      },
      {
        id: '2004',
        name: 'Purchase Order',
        status: 'completed',
        duration: '7days',
        next: [],
      },
    ],
  },
];

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const handleNodeClick = (nodeLabel: string) => {
    console.log(`Node clicked: ${nodeLabel}`);
    alert(`You clicked on: ${nodeLabel}`);
  };
  return (
    <div
      className="bg-white border border-gray-300 rounded p-2 text-center shadow-md relative w-40"
      onClick={() => {
        // handleNodeClick(data.name);
        console.log(data);
      }}
    >
      <div>{/* {data.name} {data.duration}{' '} */}</div>

      {/* Input Handle (LEFT side) */}
      {/* {data.next.map((row, index) => {
        return (
          <Handle
            type="source"
            position={Position.Right} // Place output on the RIGHT
            id={`output${index}`}
            // style={{ background: '#555' }}
            style={{
              background: '#555',
              top: `${index === 0 ? 1 : index + 30}%`, // Evenly distribute
              transform: 'translateY(-50%)',
            }}
          />
        );
      })} */}
      <Handle
        type="target"
        position={Position.Left} // Place input on the LEFT
        id="input1"
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Bottom} // Place input on the LEFT
        id="input2"
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Bottom} // Place input on the LEFT
        id="input3"
        style={{ background: '#555' }}
      />

      {/* Output Handle (RIGHT side) */}
      {/* <Handle
        type="source"
        position={Position.Right} // Place output on the RIGHT
        id="output1"
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Right} // Place output on the RIGHT
        id="output2"
        // style={{ background: '#555' }}
        style={{
          background: '#555',
          top: `5%`, // Evenly distribute
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right} // Place output on the RIGHT
        id="output3"
        // style={{ background: '#555' }}
        style={{
          background: '#555',
          top: `25%`, // Evenly distribute
          transform: 'translateY(-50%)',
        }}
      /> */}
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode, // Register the custom node type
};

const ReactFlowExp = (props: Props) => {
  // const rupom = () => {
  //   alert('Hello');
  // };

  const handleNodeClick = (nodeLabel: string) => {
    console.log(`Node clicked: ${nodeLabel}`);
    alert(`You clicked on: ${nodeLabel}`);
  };

  const generateNodes = (tasks: Task[]) =>
    tasks.map((task, index) => ({
      id: task.id,
      type: 'customNode', // Set type to the registered custom node
      // data: { label: `${task.name} (${task.duration})` },
      data: {
        id: task.id,
        name: task.name,
        status: task.status,
        duration: task.duration,
        next: task.next,
      },
      position: { x: index * 250, y: 0 }, // Calculate positions dynamically
      onClick: handleNodeClick, // Pass the click handler
    }));

  // const generateEdges = (tasks: Task[]) =>
  //   tasks.flatMap((task) =>
  //     task.next.map((nextId) => ({
  //       id: `${task.id}-${nextId}`,
  //       source: task.id,
  //       target: nextId,
  //       type: 'smoothstep', // Use smooth arrows for loops
  //       animated: true,
  //     }))
  //   );

  const generateEdges = (tasks: Task[]) =>
    tasks.flatMap((task) =>
      task.next.map((nextId) => {
        const isLoopback = parseInt(nextId, 10) < parseInt(task.id, 10); // Check if it's a backward loop

        return {
          id: `${task.id}-${nextId}`,
          source: task.id,
          sourceHandle: 'output0',
          target: nextId,
          targetHandle: 'input2',
          type: 'smoothstep', // Use `bezier` for loops, `step` for normal flow
          animated: isLoopback, // Make loopback edges animated for better visualization
          style: isLoopback
            ? { stroke: 'red', strokeWidth: 2 } // Highlight loops for clarity
            : { stroke: 'black', strokeWidth: 1 },
        };
      })
    );
  return (
    <div className="mt-10 ml-10 z-40 ">
      hell
      <div className="h-[800px] w-[100%] overflow-scroll">
        {events.map((event) => (
          <div className=" box-border border m-4">
            <div className=" text-[13px]">{event.eventNo}</div>
            <div key={event.id} className="w-[100%] h-[150px] mt-4">
              <ReactFlow
                nodes={generateNodes(event.tasks)}
                edges={generateEdges(event.tasks)}
                nodeTypes={nodeTypes} // Register custom node type
                fitView
                edgeTypes={{
                  bezier: (props) => <BezierEdge {...props} />, // Custom edge type for loops
                  step: (props) => <StepEdge {...props} />, // Default step edge
                }}
                nodesConnectable={false}
                // elementsSelectable={false}
                nodesDraggable={false} // Disable dragging of nodes
                // panOnDrag={false} // Prevent background drag
                zoomOnScroll={false} // Disable zoom on scroll
                zoomOnPinch={false} // Disable zoom on pinch gestures
                panOnScroll={false} // scrolling e j whole page upore niche jaay oita
                zoomOnDoubleClick={false}
                // maxZoom={0.7}
                fitViewOptions={{
                  padding: 0.2,
                  includeHiddenNodes: false,
                  minZoom: 0.1,
                  maxZoom: 0.7,
                  duration: 800,
                  // nodes: [{ id: 'node-1' }, { id: 'node-2' }],
                }}
                // minZoom={0.7}
              >
                <Controls
                  position="top-right"
                  className="horizontal-controls"
                />
                {/* <Background /> */}
              </ReactFlow>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactFlowExp;
