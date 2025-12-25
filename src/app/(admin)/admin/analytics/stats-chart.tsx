'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

// Mock data for MVP visualization
// Ideally this would be passed from server prop, but keeping it client-side for simplicity in this file for now
const growthData = [
  { name: 'Mon', users: 4 },
  { name: 'Tue', users: 3 },
  { name: 'Wed', users: 7 },
  { name: 'Thu', users: 5 },
  { name: 'Fri', users: 8 },
  { name: 'Sat', users: 12 },
  { name: 'Sun', users: 9 },
]

const emailData = [
  { name: 'Mon', opens: 24, clicks: 4 },
  { name: 'Tue', opens: 13, clicks: 3 },
  { name: 'Wed', opens: 38, clicks: 12 },
  { name: 'Thu', opens: 25, clicks: 8 },
  { name: 'Fri', opens: 40, clicks: 15 },
  { name: 'Sat', opens: 18, clicks: 2 },
  { name: 'Sun', opens: 22, clicks: 5 },
]

export const StatsChart = ({ type }: { type: 'growth' | 'email' }) => {
  if (type === 'growth') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={emailData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: '#f1f5f9' }}
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        <Bar dataKey="opens" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="clicks" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
