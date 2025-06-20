'use client'
import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Node,
  Edge,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 커스텀 노드 컴포넌트
const CustomNode = ({ data }: { data: { label: string; description?: string; type: string } }) => {
  const getNodeStyle = (type: string) => {
    switch (type) {
      case 'frontend':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'backend':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'database':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'storage':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'auth':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'user':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg border-2 shadow-md ${getNodeStyle(data.type)}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      <Handle type="target" position={Position.Right} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      <Handle type="target" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Left} className="w-3 h-3" />
      
      <div className="text-sm font-semibold">{data.label}</div>
      {data.description && (
        <div className="text-xs mt-1 opacity-75">{data.description}</div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// 여기에 노드들을 추가하세요
const initialNodes: Node[] = [
  // 예시: 첫 번째 노드
  // {
  //   id: 'user',
  //   type: 'custom',
  //   data: { 
  //     label: 'User', 
  //     description: 'End User',
  //     type: 'user'
  //   },
  //   position: { x: 100, y: 100 },
  // },
];

// 여기에 연결선들을 추가하세요
const initialEdges: Edge[] = [
  // 예시: 첫 번째 연결선
  // {
  //   id: 'user-signin',
  //   source: 'user',
  //   target: 'sign-in-page',
  //   type: 'smoothstep',
  //   label: 'navigates to',
  //   style: { stroke: '#6366f1', strokeWidth: 3 }
  // },
];

export default function Flow() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback (
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
  
    const onEdgesChange = useCallback (
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

  return (
    <div className="max-h-screen h-[95vh] w-full bg-gray-50">
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
        >
            <Background color="#e5e7eb" gap={20} />
            <Controls />
        </ReactFlow>
    </div>
  );
}