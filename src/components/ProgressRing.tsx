import { useEffect, useState } from 'react'

interface ProgressRingProps {
  /** 0–1 */
  value: number
  /** Outer diameter in px. Default 72. */
  size?: number
  /** Stroke width in px. Default 7. */
  strokeWidth?: number
  /** Center label. Defaults to the value as a percentage. */
  label?: string
  /** CSS color value — use a var(--…) token. Defaults to var(--color-accent). */
  color?: string
}

/**
 * SVG donut ring showing a 0–1 progress value.
 * Animates on mount using the --duration-slow token (collapses to 0 under
 * prefers-reduced-motion via tokens.css).
 */
export function ProgressRing({
  value,
  size = 72,
  strokeWidth = 7,
  label,
  color = 'var(--color-accent)',
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, value))
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const center = size / 2
  const display = label ?? `${Math.round(clamped * 100)}%`

  // Animate from 0 on mount by starting at full offset and stepping to actual.
  const [offset, setOffset] = useState(circumference)
  useEffect(() => {
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setOffset(circumference * (1 - clamped)))
    })
    return () => cancelAnimationFrame(id)
  }, [clamped, circumference])

  return (
    <svg
      className="progress-ring"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${display} complete`}
    >
      {/* Track */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={strokeWidth}
      />
      {/* Fill — rotated so progress starts at 12 o'clock */}
      <circle
        className="progress-ring__fill"
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        className="progress-ring__label"
      >
        {display}
      </text>
    </svg>
  )
}
