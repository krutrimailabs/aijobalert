import React, { ReactNode } from 'react'

interface QuickStatsProps {
  icon: ReactNode
  label: string
  value: string
  color: string
  bgColor: string
}

export function QuickStats({ icon, label, value, color, bgColor }: QuickStatsProps) {
  return (
    <div className="flex items-center gap-3 bg-white/80 rounded-xl p-3 border border-slate-200 min-w-[180px]">
      <div className={`p-2 rounded-lg ${bgColor} ${color}`}>{icon}</div>
      <div>
        <div className="text-lg font-bold text-slate-900">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  )
}
