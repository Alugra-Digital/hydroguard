interface SparklineProps {
  color: string
  heights: number[]
}

export default function Sparkline({ color, heights }: SparklineProps) {
  return (
    <svg className="w-16 h-8" viewBox="0 0 100 40">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 16}
          y={40 - h}
          width={10}
          height={h}
          rx={1.5}
          fill={color}
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
        />
      ))}
    </svg>
  )
}
