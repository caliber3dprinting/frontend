'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export interface TimeseriesPoint {
  date: string
  sessions: number
  users: number
  conversions: number
}

const axisStyle = { fontSize: 11, fill: '#71717a' }
const tooltipStyle = {
  background: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: 8,
  color: '#fafafa',
  fontSize: 12,
}

function shortDate(d: string): string {
  // YYYY-MM-DD → DD/MM
  const parts = d.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : d
}

export function SessionsChart({ data }: { data: TimeseriesPoint[] }) {
  if (!data.length) {
    return <p className="text-sm text-zinc-500 py-12 text-center">Sin datos para el rango.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis dataKey="date" tickFormatter={shortDate} tick={axisStyle} stroke="#3f3f46" minTickGap={24} />
        <YAxis tick={axisStyle} stroke="#3f3f46" allowDecimals={false} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: '#a1a1aa' }}
          labelFormatter={(label) => shortDate(String(label))}
        />
        <Line type="monotone" dataKey="sessions" name="Sesiones" stroke="#f97316" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="users" name="Usuarios" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function ChannelsChart({ data }: { data: { name: string; sessions: number }[] }) {
  if (!data.length) {
    return <p className="text-sm text-zinc-500 py-12 text-center">Sin datos de canales.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
        <XAxis type="number" tick={axisStyle} stroke="#3f3f46" allowDecimals={false} />
        <YAxis type="category" dataKey="name" tick={axisStyle} stroke="#3f3f46" width={110} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#27272a55' }} />
        <Bar dataKey="sessions" name="Sesiones" fill="#f97316" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
