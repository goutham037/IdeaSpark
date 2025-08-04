import { motion } from "framer-motion";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ScoreCircle({ score, size = "md", showLabel = false }: ScoreCircleProps) {
  const getSize = () => {
    switch (size) {
      case "sm":
        return { width: 48, height: 48, radius: 18, strokeWidth: 3 };
      case "lg":
        return { width: 80, height: 80, radius: 32, strokeWidth: 4 };
      default:
        return { width: 64, height: 64, radius: 24, strokeWidth: 4 };
    }
  };

  const getColor = (score: number) => {
    if (score >= 80) return "#10b981"; // emerald-500
    if (score >= 60) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const getTextColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const { width, height, radius, strokeWidth } = getSize();
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";
  const fontWeight = size === "lg" ? "font-bold" : "font-semibold";

  return (
    <div className="relative">
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={normalizedRadius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={height / 2}
          r={normalizedRadius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`${textSize} ${fontWeight} ${getTextColor(score)}`}>
          {score}
        </span>
      </div>
      
      {/* Optional label */}
      {showLabel && (
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">Viability Score</span>
        </div>
      )}
    </div>
  );
}
