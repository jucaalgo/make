import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
    type EdgeProps,
} from '@xyflow/react';
import { X } from 'lucide-react';


export const SmartEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}: EdgeProps) => {
    const { setEdges } = useReactFlow();
    // We effectively use onEdgesChange or internal logic
    // Actually, simpler to just use setEdges from ReactFlow context or store's methodology.
    // Let's use the store's delete method if available, or standard ReactFlow wiring.
    // Ideally, we trigger a delete event.

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setEdges((edges) => edges.filter((e) => e.id !== id));
    };

    return (
        <div className="group">
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        // everything inside EdgeLabelRenderer has no pointer events by default
                        // if you have an interactive element, set pointer-events: all
                        pointerEvents: 'all',
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                    <button
                        className="w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center shadow-md hover:bg-red-600 hover:scale-110 transition-transform cursor-pointer"
                        onClick={onEdgeClick}
                        title="Disconnect"
                    >
                        <X size={10} strokeWidth={3} />
                    </button>
                </div>
            </EdgeLabelRenderer>
        </div>
    );
};
