interface SparklineProps {
  /** Accuracy values 0–1, oldest first. Need at least 2 to draw a line. */
  values: number[]
  /** ViewBox width in px. Default 80. */
  width?: number
  /** ViewBox height in px. Default 32. */
  height?: number
  /** CSS color value — use a var(--…) token. Defaults to var(--color-accent). */
  color?: string
}

/**
 * Small inline SVG line chart for showing a trend at a glance.
 * aria-hidden: purely decorative — the surrounding text carries the meaning.
 */
export function Sparkline({ values, width = 80, height = 32, color = 'var(--color-accent)' }: SparklineProps) {
  if (values.length < 2) return null

  const pad = 3
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  // If all values are equal, center them vertically rather than collapsing to a flat line.
  const range = maxV - minV || 1

  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2)
    const y = pad + (1 - (v - minV) / range) * (height - pad * 2)
    return { x, y }
  })

  const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ')

  // Close the area polygon below the line
  const areaPoints = [
    `${pad},${height - pad}`,
    ...pts.map(p => `${p.x},${p.y}`),
    `${width - pad},${height - pad}`,
  ].join(' ')

  return (
    <svg
      className="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <polygon points={areaPoints} fill={color} opacity="0.12" />
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* End-point dot */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2" fill={color} />
    </svg>
  )
}
