import { memo } from "react";

interface Circle {
  radius: number;
  colors: string[]; // 3 segment colors
  strokeWidth: number;
  duration: number;
  sortedAngles: number[]; // pre-sorted angles for the 3 nodes
  opacity: number; // opacity for the arc segments
}

const offset = 480;
const circleStrokeWidth = 128;
const orbitSpacing = 220; // Distance between each orbit

// Node sizing based on circle stroke width
const nodeRadius = circleStrokeWidth * 0.4; // Node radius is half the stroke width
const nodeBorderWidth = circleStrokeWidth * 0.2; // Border is 10% of stroke width

// Pre-compute and sort angles at module level to avoid runtime sorting
const circles: Circle[] = [
  {
    radius: orbitSpacing * 5 + offset,
    colors: ["#7DD3FC", "#F9A8D4", "#FDE047"], // sky-300, pink-300, yellow-300
    strokeWidth: circleStrokeWidth,
    duration: 50,
    sortedAngles: [0, 120, 240], // already sorted
    opacity: 0.5,
  },
  {
    radius: orbitSpacing * 4 + offset,
    colors: ["#86EFAC", "#7DD3FC", "#F9A8D4"], // green-300, sky-300, pink-300
    strokeWidth: circleStrokeWidth,
    duration: 40,
    sortedAngles: [30, 150, 270], // already sorted
    opacity: 0.6,
  },
  {
    radius: orbitSpacing * 3 + offset,
    colors: ["#FDE047", "#86EFAC", "#7DD3FC"], // yellow-300, green-300, sky-300
    strokeWidth: circleStrokeWidth,
    duration: 35,
    sortedAngles: [60, 180, 300], // already sorted
    opacity: 0.7,
  },
  {
    radius: orbitSpacing * 2 + offset,
    colors: ["#F9A8D4", "#FDE047", "#86EFAC"], // pink-300, yellow-300, green-300
    strokeWidth: circleStrokeWidth,
    duration: 30,
    sortedAngles: [90, 210, 330], // already sorted
    opacity: 0.8,
  },
  {
    radius: orbitSpacing * 1 + offset,
    colors: ["#7DD3FC", "#F9A8D4", "#FDE047"], // sky-300, pink-300, yellow-300
    strokeWidth: circleStrokeWidth,
    duration: 25,
    sortedAngles: [45, 165, 285], // already sorted
    opacity: 0.9,
  },
];

// Calculate position on circle using trigonometry (in SVG coordinates)
const getSVGPosition = (radius: number, angle: number) => {
  const radian = (angle * Math.PI) / 180;
  return {
    x: radius * Math.cos(radian),
    y: radius * Math.sin(radian),
  };
};

// Helper function to create an arc path
const createArcPath = (
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = getSVGPosition(radius, startAngle);
  const end = getSVGPosition(radius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

// Pre-compute static styles to avoid object creation on each render
const containerStyle = { zIndex: 0 } as const;
const svgStyle = { minWidth: "100%", minHeight: "100%" } as const;

// Memoized component to prevent unnecessary re-renders
export const AnimatedCircles = memo(function AnimatedCircles() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      style={containerStyle}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* SVG with circles and nodes */}
        <svg
          className="absolute"
          width="100%"
          height="100%"
          viewBox="-900 -900 1800 1800"
          preserveAspectRatio="xMidYMid meet"
          style={svgStyle}
        >
          {/* Orbiting arcs and nodes - each circle gets its own rotating group */}
          {circles.map((circle, circleIndex) => (
            <g key={circleIndex}>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur={`${circle.duration}s`}
                repeatCount="indefinite"
              />
              {/* Colored arc segments */}
              {circle.sortedAngles.map((startAngle, i) => {
                const endAngle = circle.sortedAngles[(i + 1) % 3];
                const adjustedEndAngle =
                  endAngle <= startAngle ? endAngle + 360 : endAngle;
                return (
                  <path
                    key={i}
                    d={createArcPath(
                      circle.radius,
                      startAngle,
                      adjustedEndAngle
                    )}
                    fill="none"
                    stroke={circle.colors[i]}
                    strokeWidth={circle.strokeWidth}
                    strokeLinecap="round"
                    opacity={circle.opacity}
                  />
                );
              })}
              {/* Nodes - color derived from segment color */}
              {circle.sortedAngles.map((angle, i) => {
                const position = getSVGPosition(circle.radius, angle);
                return (
                  <g key={i}>
                    {/* White circle with colored ring border */}
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={nodeRadius}
                      fill="white"
                    />
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={nodeRadius}
                      fill="none"
                      stroke={circle.colors[i]}
                      strokeWidth={nodeBorderWidth}
                    />
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
});
