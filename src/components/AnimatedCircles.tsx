import { motion } from 'framer-motion';

interface Circle {
    radius: number;
    color: string;
    strokeWidth: number;
}

interface Node {
    circleIndex: number;
    angle: number;
    duration: number;
    color: string;
}


const offset = 640;
const circleStrokeWidth = 128;
const orbitSpacing = 200; // Distance between each orbit

const circles: Circle[] = [
    { radius: orbitSpacing * 5 + offset, color: '#9b8fb5', strokeWidth: circleStrokeWidth }, // Muted purple-gray
    { radius: orbitSpacing * 4 + offset, color: '#7ba3c7', strokeWidth: circleStrokeWidth }, // Soft blue
    { radius: orbitSpacing * 3 + offset, color: '#c9a3a3', strokeWidth: circleStrokeWidth }, // Muted rose
    { radius: orbitSpacing * 2 + offset, color: '#b5a3c7', strokeWidth: circleStrokeWidth }, // Soft lavender
    { radius: orbitSpacing * 1 + offset, color: '#a3b5c7', strokeWidth: circleStrokeWidth }, // Light blue-gray
];

const nodes: Node[] = [
    { circleIndex: 0, angle: 45, duration: 50, color: '#9b8fb5' },
    { circleIndex: 0, angle: 225, duration: 50, color: '#9b8fb5' },
    { circleIndex: 1, angle: 90, duration: 40, color: '#7ba3c7' },
    { circleIndex: 1, angle: 270, duration: 40, color: '#7ba3c7' },
    { circleIndex: 2, angle: 135, duration: 35, color: '#c9a3a3' },
    { circleIndex: 2, angle: 315, duration: 35, color: '#c9a3a3' },
    { circleIndex: 3, angle: 60, duration: 30, color: '#b5a3c7' },
    { circleIndex: 3, angle: 240, duration: 30, color: '#b5a3c7' },
    { circleIndex: 4, angle: 120, duration: 25, color: '#a3b5c7' },
    { circleIndex: 4, angle: 300, duration: 25, color: '#a3b5c7' },
];

// Calculate position on circle using trigonometry (in SVG coordinates)
const getSVGPosition = (radius: number, angle: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
        x: radius * Math.cos(radian),
        y: radius * Math.sin(radian),
    };
};

// Node sizing based on circle stroke width
const nodeRadius = circleStrokeWidth * 0.4; // Node radius is half the stroke width
const nodeBorderWidth = circleStrokeWidth * 0.15; // Border is 10% of stroke width

export function AnimatedCircles() {
    return (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            <div className="relative w-full h-full flex items-center justify-center">
                {/* SVG with circles and nodes */}
                <svg
                    className="absolute"
                    width="100%"
                    height="100%"
                    viewBox="-900 -900 1800 1800"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ minWidth: '100%', minHeight: '100%' }}
                >
                    {/* Static concentric circles */}
                    {circles.map((circle, index) => (
                        <circle
                            key={`circle-${index}`}
                            cx="0"
                            cy="0"
                            r={circle.radius}
                            fill="none"
                            stroke={circle.color}
                            strokeWidth={circle.strokeWidth}
                            opacity="0.35"
                        />
                    ))}

                    {/* Orbiting nodes - each circle gets its own rotating group */}
                    {circles.map((circle, circleIndex) => {
                        const circleNodes = nodes.filter(node => node.circleIndex === circleIndex);
                        if (circleNodes.length === 0) return null;

                        // Use the duration of the first node for this circle
                        const duration = circleNodes[0].duration;

                        return (
                            <motion.g
                                key={`orbit-${circleIndex}`}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: duration,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                {circleNodes.map((node, nodeIndex) => {
                                    const position = getSVGPosition(circle.radius, node.angle);
                                    return (
                                        <g key={`node-${circleIndex}-${nodeIndex}`}>
                                            {/* White circle with colored ring border */}
                                            <circle
                                                cx={position.x}
                                                cy={position.y}
                                                r={nodeRadius}
                                                fill="white"
                                                opacity="0.9"
                                            />
                                            <circle
                                                cx={position.x}
                                                cy={position.y}
                                                r={nodeRadius}
                                                fill="none"
                                                stroke={node.color}
                                                strokeWidth={nodeBorderWidth}
                                                opacity="0.9"
                                            />
                                        </g>
                                    );
                                })}
                            </motion.g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
