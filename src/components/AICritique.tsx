import { useTheme } from 'next-themes'
import { useEffect, useMemo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BrainCircuit, Lightbulb, Sparkles } from 'lucide-react'
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Node,
  Edge,
  Handle
} from 'reactflow'
import dagre from 'dagre'
import 'reactflow/dist/style.css'
import { MindMapNode } from '@/lib/ai'

export interface AICritiqueData {
  summary: string
  mindmap: MindMapNode
}

interface AICritiqueProps {
  data: AICritiqueData | null
}

// Custom Node Component for better visuals
const MindMapNodeComponent = ({ data }: { data: { label: string, depth: number } }) => {
  // Styles based on depth
  const isRoot = data.depth === 0
  const isLevel1 = data.depth === 1
  
  let bgClass = "bg-white dark:bg-slate-800"
  let borderClass = "border-slate-200 dark:border-slate-700"
  let textClass = "text-slate-700 dark:text-slate-200"
  let shadowClass = "shadow-sm"
  
  if (isRoot) {
    bgClass = "bg-purple-50 dark:bg-purple-900/30"
    borderClass = "border-purple-300 dark:border-purple-500"
    textClass = "text-purple-900 dark:text-purple-100 font-bold text-lg"
    shadowClass = "shadow-lg shadow-purple-100 dark:shadow-purple-900/20"
  } else if (isLevel1) {
    bgClass = "bg-blue-50 dark:bg-blue-900/20"
    borderClass = "border-blue-200 dark:border-blue-700"
    textClass = "text-blue-800 dark:text-blue-100 font-semibold"
    shadowClass = "shadow-md"
  }

  return (
    <div className={`px-4 py-3 rounded-xl border-2 ${bgClass} ${borderClass} ${textClass} ${shadowClass} min-w-[150px] text-center transition-all duration-200 hover:scale-105`}>
      <Handle type="target" position={Position.Left} className="!bg-slate-300 dark:!bg-slate-600 !w-2 !h-2 !-left-2.5" />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} className="!bg-slate-300 dark:!bg-slate-600 !w-2 !h-2 !-right-2.5" />
    </div>
  )
}

const nodeTypes = {
  mindmap: MindMapNodeComponent,
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 50, // Vertical spacing between nodes
    ranksep: 100 // Horizontal spacing between ranks
  })

  nodes.forEach((node) => {
    // Approximate size for layout calculation
    // Dagre needs width/height to calculate layout. 
    // Since we use custom nodes with dynamic content, we estimate.
    // Root is bigger.
    const width = node.data.label.length * 10 + 60
    const height = node.data.depth === 0 ? 60 : 50
    dagreGraph.setNode(node.id, { width, height })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = isHorizontal ? Position.Left : Position.Top
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - (nodeWithPosition.width / 2),
      y: nodeWithPosition.y - (nodeWithPosition.height / 2),
    }

    return node
  })

  return { nodes: layoutedNodes, edges }
}

export function AICritique({ data }: AICritiqueProps) {
  const { theme } = useTheme()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Flatten the tree into nodes and edges for React Flow
  const processData = useCallback((root: MindMapNode) => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []
    
    const traverse = (node: MindMapNode, parentId: string | null = null, depth = 0) => {
      const id = parentId ? `${parentId}_${newNodes.length}` : 'root'
      
      newNodes.push({
        id,
        type: 'mindmap',
        data: { label: node.label || 'Node', depth },
        position: { x: 0, y: 0 }, // Initial position, will be computed by dagre
      })

      if (parentId) {
        newEdges.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          type: 'smoothstep', // smoothstep, bezier, straight
          animated: true,
          style: { stroke: depth === 1 ? '#94a3b8' : '#cbd5e1', strokeWidth: 2 },
        })
      }

      if (node.children) {
        node.children.forEach(child => traverse(child, id, depth + 1))
      }
    }

    traverse(root)
    return { nodes: newNodes, edges: newEdges }
  }, [])

  useEffect(() => {
    if (data?.mindmap) {
      const { nodes: initialNodes, edges: initialEdges } = processData(data.mindmap)
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
      )
      
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
    }
  }, [data?.mindmap, processData, setNodes, setEdges])

  if (!data || (!data.summary && !data.mindmap)) return null

  const isDark = theme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))

  return (
    <Card className="my-8 border-purple-200 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3 border-b border-purple-100 dark:border-purple-800/50">
        <CardTitle className="flex items-center gap-2 text-lg text-purple-700 dark:text-purple-300">
          <Sparkles className="h-5 w-5" />
          AI 锐评 & 深度导读
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Text Summary Section */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-medium text-sm text-muted-foreground uppercase tracking-wider">
            <Lightbulb className="h-4 w-4 text-amber-500" /> 
            核心观点与建议
          </h4>
          <div className="ai-critique-summary bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30">
            <ReactMarkdown
              className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90"
              components={{
                p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                li: ({ ...props }) => <li className="pl-1" {...props} />,
                h1: ({ ...props }) => <h3 className="text-xl font-bold mt-6 mb-4" {...props} />,
                h2: ({ ...props }) => <h3 className="text-lg font-bold mt-5 mb-3" {...props} />,
                h3: ({ ...props }) => <h4 className="text-base font-bold mt-4 mb-2" {...props} />,
              }}
            >
              {data.summary}
            </ReactMarkdown>
          </div>
        </div>

        {/* Mind Map Section */}
        {data.mindmap && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-medium text-sm text-muted-foreground uppercase tracking-wider">
              <BrainCircuit className="h-4 w-4 text-blue-500" /> 
              全⽂思维导图
            </h4>
            <div className="h-[500px] w-full border border-purple-100 dark:border-purple-800/30 rounded-lg bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
               <ReactFlow
                 nodes={nodes}
                 edges={edges}
                 onNodesChange={onNodesChange}
                 onEdgesChange={onEdgesChange}
                 nodeTypes={nodeTypes}
                 fitView
                 fitViewOptions={{ padding: 0.2 }}
                 minZoom={0.1}
                 maxZoom={1.5}
                 attributionPosition="bottom-right"
               >
                 <Background color={isDark ? '#334155' : '#cbd5e1'} gap={20} size={1} />
                 <Controls className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200" />
               </ReactFlow>
            </div>
          </div>
        )}
      </CardContent>
      <style dangerouslySetInnerHTML={{__html: `
        /* AI Critique Summary Styles */
        .ai-critique-summary .prose {
          color: inherit;
        }
        .ai-critique-summary .prose p {
          margin-top: 0.75em;
          margin-bottom: 0.75em;
          line-height: 1.75;
        }
        .ai-critique-summary .prose ul,
        .ai-critique-summary .prose ol {
          margin-top: 0.75em;
          margin-bottom: 0.75em;
          padding-left: 1.5em;
        }
        .ai-critique-summary .prose li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        .ai-critique-summary .prose strong {
          font-weight: 600;
        }
        .ai-critique-summary .prose h3,
        .ai-critique-summary .prose h4 {
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        
        /* React Flow Dark Mode Overrides if needed */
        .react-flow__controls-button {
           border-bottom: 1px solid #e2e8f0;
        }
        .dark .react-flow__controls-button {
           border-bottom: 1px solid #334155;
           background: #1e293b;
           fill: #e2e8f0;
        }
        .dark .react-flow__controls-button:hover {
           background: #334155;
        }
        .dark .react-flow__edge-path {
           stroke: #64748b;
        }
        .dark .react-flow__attribution {
           background: rgba(30, 41, 59, 0.5);
           color: #94a3b8;
        }
      `}} />
    </Card>
  )
}
