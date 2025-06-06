import { FC } from "react";

type DonutChartProps = {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
};

export const DonutChart: FC<DonutChartProps> = ({
    percentage,
    size = 240,
    strokeWidth = 12,
    color = "#4f46e5",
    backgroundColor = "#e5e7eb",
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    return (
        <svg width={size} height={size}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={backgroundColor}
                strokeWidth={strokeWidth}
                fill="none"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={size * 0.22}
                fontWeight="bold"
                fill="#111827"
            >
                {Math.round(percentage)}%
            </text>
        </svg>
    );
};
